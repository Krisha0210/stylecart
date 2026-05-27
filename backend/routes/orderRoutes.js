import express from "express";
import Order from "../models/order.js";

const router = express.Router();

/* CREATE ORDER */

router.post("/", async (req, res) => {

try {

const order = new Order(req.body);

const createdOrder = await order.save();

res.status(201).json(createdOrder);

}

catch(error){

res.status(500).json({
message:error.message
});

}

});

/* GET USER ORDERS */

router.get("/user/:id", async (req,res)=>{

try{

const orders = await Order.find({
user:req.params.id
}).sort({
createdAt:-1
});

res.json(orders);

}

catch(error){

res.status(500).json({
message:error.message
});

}

});

export default router;