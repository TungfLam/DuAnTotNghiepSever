exports.getProductsList = async (req, res, next) => {
    let msg = "";
    try {
      // Lấy danh sách sản phẩm
      const productList = await myModel.Product.find({}).populate(
        "categoryId",
        "name"
      );
  
      if (!productList) {
        msg = "Danh sách sản phẩm trống";
      }
      const categories = await myModel.Category.find();
  
      res.render("products/list_products", {
        productList: productList,
        categories: categories,
        msg: msg,
      });
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).send("Đã xảy ra lỗi khi tải danh sách sản phẩm.");
    }
  };

  exports.addProduct = async (req, res, next) => {
  let msg = "";
  if (req.method === "POST") {
    try {
      // Extract product data from the request body
      const { name, description, price, categoryId } = req.body;
      const files = req.files;
      const images = [];
      for (const file of files) {
        const imageData = fs.readFileSync(file.path);
        const base64Image = imageData.toString("base64");
        const mimeType = file.mimetype;
        const base64 = `data:${mimeType};base64,${base64Image}`;
        images.push(base64);
      }

      // Create an object with the extracted data
      const productData = {
        name,
        description,
        price,
        images,
        categoryId, // categoryId đã được định dạng là ObjectID
      };

      // Tạo một sản phẩm mới
      const product = new myModel.Product(productData);

      // Lưu sản phẩm vào cơ sở dữ liệu
      const savedProduct = await product.save();

      msg = "ADD PRODUCT SUCCESSFULLY";
      console.log("Thêm sản phẩm thành công");
      console.log(savedProduct);
    } catch (error) {
      console.log("lỗi");
      console.log(error);
      msg = "Error";
    }
  }
  const categoryList = await myModel.Category.find();
  res.render("products/add_product", {
    msg: msg,
    categoryList: categoryList,
  });
};