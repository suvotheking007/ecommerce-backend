const sqlConnection = require("../services/sqlConnection");

module.exports = {
  listOrderDetails: function (data, cb) {
    let sql =
      "select * from OrderDetails inner join OrderItems on OrderDetails.ID = OrderItems.OrderID inner join Products on OrderItems.ProductID = Products.ID where UserID = ?;";

    const values = [];
    values.push(data.user_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  findOrderByUser: function (data, cb) {
    let sql = `select * from OrderDetails where UserID = ? and OrderStatus = 1`;
    const values = [];
    values.push(data.user_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  addOrder: function (data, cb) {
    let sql = `insert into OrderDetails 
               (Total, UserID, OrderStatus, CreatedAt, UpdatedAt)
               values
               (?, ?, 1, now(), now());`;

    let values = [];
    values.push(data.total);
    values.push(data.user_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  editOrder: function (data, cb) {
    let sql = `update OrderDetails 
               set Total = ?, OrderStatus = ?, UpdatedAt = now()
               where
               ID = ?`;
    let values = [];

    if (data.payment) {
      sql = `update OrderDetails
             set OrderStatus = ?, UpdatedAt = now()
             where
             ID = ?`;
      values.push(2);
    } else {
      values.push(data.total);
      values.push(1);
    }

    values.push(data.order_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  getOrderDetails: function (data, cb) {
    let sql = `select 
               od.ID, od.Total, p.ID as ProductID, 
               p.Name as ProductName, p.Price as ProductPrice,
               oi.Quantity as ProductQuantity
               from
               OrderDetails as od 
               left join OrderItems as oi on od.ID = oi.OrderID
               left join Products as p on p.ID = oi.ProductID
               where
               od.UserID = ? and od.OrderStatus = 1`;
    let values = [];
    values.push(data.user_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  addOrderItem: function (data, cb) {
    let sql = `insert into OrderItems
               (OrderID, ProductID, Quantity, CreatedAt, UpdatedAt)
               values
               (?, ?, ?, now(), now())`;
    let values = [];
    values.push(data.order_id);
    values.push(data.product_id);
    values.push(data.quantity);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  editOrderItem: function (data, cb) {
    let sql = `update OrderItems set
               Quantity = ?, UpdatedAt = now()
               where
               OrderID = ? and ProductID = ?`;
    let values = [];
    values.push(data.quantity);
    values.push(data.order_id);
    values.push(data.product_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  deleteOrderItem: function (data, cb) {
    let sql = `delete from OrderItems
               where 
               OrderID = ? and ProductID = ?`;
    let values = [];
    values.push(data.order_id);
    values.push(data.product_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  getOrderItem: function (data, cb) {
    let sql = `select * from OrderItems
               where
               OrderID = ? and ProductID = ?`;
    let values = [];
    values.push(data.order_id);
    values.push(data.product_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  getOrderProduct: function (data, cb) {
    const values = [];
    let sql = `select * from 
               OrderItems inner join Products on OrderItems.ProductID = Products.ID where 
               Products.ID = ? and OrderItems.OrderID = ?;`;

    values.push(data.product_id);
    values.push(data.order_id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },
};
