# Dự án RestAPI với Node.js, Express, MongoDB, JWT và Redis

## Giới thiệu

Dự án này là một ứng dụng RestAPI sử dụng Node.js và Express cho back-end, MongoDB cho cơ sở dữ liệu, JWT cho xác thực và Redis cho caching. Ứng dụng này được thiết kế để phục vụ một Single Page Application (SPA) nhằm cung cấp trải nghiệm người dùng mượt mà và hiệu quả.

## Các công nghệ sử dụng

- **Back-end**: Node.js, Express
- **Cơ sở dữ liệu**: MongoDB
- **Xác thực**: JSON Web Tokens (JWT)
- **Caching**: Redis

## Chức năng chính

- Đăng ký và đăng nhập người dùng
- Xác thực và phân quyền người dùng
- Quản lý sản phẩm (thêm, sửa, xóa, xem chi tiết)
- Quản lý đơn hàng (tạo, cập nhật, xóa)
- Caching dữ liệu sản phẩm với Redis để cải thiện hiệu suất

## Cài đặt

### Yêu cầu hệ thống

- Node.js và npm
- MongoDB
- Redis

### Cài đặt back-end

1. Clone repository này về máy:
    ```sh
    git clone https://github.com/yourusername/your-repo.git
    ```

2. Chuyển đến thư mục back-end:
    ```sh
    cd your-repo/backend
    ```

3. Cài đặt các dependencies:
    ```sh
    npm install
    ```

4. Tạo file `.env` trong thư mục back-end và cấu hình các biến môi trường:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/yourdbname
    JWT_SECRET=your_jwt_secret
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```

5. Khởi động MongoDB và Redis nếu chưa chạy:
    ```sh
    mongod
    redis-server
    ```

6. Khởi động server:
    ```sh
    npm start
    ```

## Sử dụng

### API Endpoints

#### Authentication

- **Đăng ký**
    ```
    POST /api/auth/register
    Body: {
        "username": "string",
        "password": "string",
        "email": "string"
    }
    ```

- **Đăng nhập**
    ```
    POST /api/auth/login
    Body: {
        "username": "string",
        "password": "string"
    }
    ```

#### Products

- **Lấy danh sách sản phẩm**
    ```
    GET /api/products
    ```

- **Thêm sản phẩm mới**
    ```
    POST /api/products
    Headers: {
        "Authorization": "Bearer <token>"
    }
    Body: {
        "name": "string",
        "price": "number",
        "description": "string",
        "category": "string"
    }
    ```

- **Cập nhật sản phẩm**
    ```
    PUT /api/products/:id
    Headers: {
        "Authorization": "Bearer <token>"
    }
    Body: {
        "name": "string",
        "price": "number",
        "description": "string",
        "category": "string"
    }
    ```

- **Xóa sản phẩm**
    ```
    DELETE /api/products/:id
    Headers: {
        "Authorization": "Bearer <token>"
    }
    ```

#### Orders

- **Tạo đơn hàng mới**
    ```
    POST /api/orders
    Headers: {
        "Authorization": "Bearer <token>"
    }
    Body: {
        "products": [
            {
                "productId": "string",
                "quantity": "number"
            }
        ],
        "totalPrice": "number"
    }
    ```

- **Cập nhật đơn hàng**
    ```
    PUT /api/orders/:id
    Headers: {
        "Authorization": "Bearer <token>"
    }
    Body: {
        "products": [
            {
                "productId": "string",
                "quantity": "number"
            }
        ],
        "totalPrice": "number"
    }
    ```

- **Xóa đơn hàng**
    ```
    DELETE /api/orders/:id
    Headers: {
        "Authorization": "Bearer <token>"
    }
    ```

## Contributing

Nếu bạn muốn đóng góp cho dự án này, vui lòng fork repository này và tạo một pull request với các thay đổi của bạn. Chúng tôi hoan nghênh tất cả các đóng góp!

## License

Dự án này được cấp phép theo [MIT License](LICENSE).
