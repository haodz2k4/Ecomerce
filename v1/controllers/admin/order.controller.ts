import { Request, Response } from "express";
import { Error } from "mongoose";
import XLSX from "xlsx";
//model
import Order from "../../../models/order.model";
import OrderItem from "../../../models/order-detail.model";
//helpers
import { buildFindQuery, buildSorting } from '../../../helpers/search.helper';
import { getPagination } from '../../../helpers/pagination.helper';
//[GET] "/admin/orders"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try {
        const find = buildFindQuery(req);
        const sort = buildSorting(req,{createdAt: 'desc'});
        const counts = await Order.countDocuments(find);
        const pagination = getPagination(req,counts, 15);
        const orders = await Order
        .find(find)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('user_id','fullName avatar')
        .populate('address_id','city street district')
        if(orders.length === 0){
            res.status(404).json({message: "Không có hóa đơn nào"});
            return;
        }    
        res.status(200).json({orders})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi trong truy vấn cơ sỡ dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
} 
//[GET] "/admin/orders/detail/:id"
export const detail = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;

    try {
        const order = await Order
        .findById(id)
        .populate('user_id','fullName avatar')
        .populate('address_id','city street district').select("-deleted")
        if(!order){
            res.status(404).json({message: "Hóa đơn không tồn tại"});
            return; 
        }
        const orders = await OrderItem.find({order_id: id}).populate({
            path: 'product_id',
            select: 'title avatar status price discountPercentage position',
            match: {
                deleted: false,
                status: "active"
            }
        })

        res.status(200).json({order,orders})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi trong truy vấn cơ sỡ dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
} 
export const exportOrder = async (req: Request, res: Response): Promise<void> => {
    const type = req.params.type;
    const id = req.params.id;
    try {
        if (type === 'excel') {
            const order: any = await Order
                .findById(id)
                .populate('user_id', 'fullName avatar')
                .populate('address_id', 'city street district')
                .select("-deleted");

            if (!order) {
                res.status(404).json({ message: "Hóa đơn không tồn tại" });
                return;
            }

            const orderItems = await OrderItem.find({ order_id: id }).populate({
                path: 'product_id',
                select: 'title avatar status price discountPercentage position',
                match: {
                    deleted: false,
                    status: "active"
                }
            });

            // Chuẩn bị dữ liệu cho Excel
            const orderData = orderItems.map((orderDetail: any) => ({
                'Order ID': order.id,
                'Customer Name': order.user_id.fullName,
                'Street': order.address_id.street,
                'City': order.address_id.city,
                'Product Title': orderDetail.product_id.title,
                'Product Price': orderDetail.product_id.price,
                'Quantity': orderDetail.quantity,
                'Total Price': orderDetail.quantity * orderDetail.product_id.price,
                'Discount Percentage': orderDetail.product_id.discountPercentage,
                'Created At': new Date(order.createdAt).toLocaleString(),
            }));

            // Tạo workbook và sheet mới
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(orderData);
            XLSX.utils.book_append_sheet(wb, ws, 'Orders');

            // Ghi workbook vào buffer
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            // Thiết lập header và gửi buffer
            res.setHeader('Content-Disposition', 'attachment; filename=order.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } else {
            res.status(400).json({ message: "Thể Loại File Không xác định" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi trong quá trình xuất file" });
    }
};