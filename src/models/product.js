const sqlConnection = require("../services/sqlConnection");

module.exports = {
  listProducts: function (data, cb) {
    let sql = "select ID as productId, Name as name from Products";
    const values = [];

    if (data.category_id) {
      sql += " where CategoryID = ?";
      values.push(data.categoryId);

      if (data.min_price) {
        sql += " and Price >= ?";
        values.push(data.min_price);
      }
    } else if (data.min_price) {
      sql += " where Price >= ?";
      values.push(data, minPrice);
    } else if (data.max_price) {
      sql += " where Price <= ?";
      values.push(data.max_price);
    }

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  addProduct: function (data, cb) {
    let sql = `insert into Products (Name, Description, Price, VendorID, CategoryID, CreatedAt, UpdatedAt)
                 values
                 (?, ?, ?, ?, ?, now(), now())`;
    let values = [];
    values.push(data.name);
    values.push(data.description);
    values.push(data.price);
    values.push(data.vendorId);
    values.push(data.categoryId);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  getProductById: function (id, cb) {
    let sql = "select * from Products where ID = ?";
    const values = [];
    values.push(id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  getProductDetails: function (data, cb) {
    let sql = `select p.Name, p.Description, p.Price,
               if((select count(*) from OrderDetails as od
                   left join OrderItems as oi on od.ID = oi.OrderID
                   where p.ID = oi.ProductID and od.UserID = ? and od.OrderStatus = 1) > 0, 1, 0) as addedToCart
                from Products as p
                where p.ID = ? limit 1`;
    let values = [];
    values.push(data.user_id);
    values.push(data.product_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },
};
