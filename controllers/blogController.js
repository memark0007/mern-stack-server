// ติดต่อกับ DATABASE
const slugify = require("slugify")
const Blogs = require("../models/blogs")
const { v4: uuidv4 } = require("uuid")

// บันทึกข้อมูล
exports.create = async (req, res) => {
    const { title, content, author } = req.body
    let slug = slugify(title)

    if (!slug) slug = uuidv4()

    //validation data
    switch (true) {
        case !title:
            return res.status(400).json({ error: "กรุณาป้อนชื่อบทความ" })
            break; //ป้องกันบัค
        case !content:
            return res.status(400).json({ error: "กรุณาป้อนเนื้อหาบทความ" })
            break;
    }

    //บันทึกข้อมูล
    try {
        const blog = await Blogs.create({ title, content, author, slug })
        res.json(blog)
    } catch (err) {
        res.status(400).json({ error: "มีชื่อบทความซ้ำกัน" })
    }
}

//ดึงข้อมูลบทความทั้งหมด
exports.getAllblogs = async (req, res) => {
    try {
        const blogs = await Blogs.find({}).exec();
        res.json(blogs);
    } catch (err) {
        // Handle error here
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.singleBlog = async (req, res) => {
    try {
        const { slug } = req.params
        const blog = await Blogs.findOne({ slug }).exec()
        res.json(blog)
    } catch (err) {
        // Handle error here
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.remove = async (req, res) => {
    try {
        const { slug } = req.params
        await Blogs.findOneAndRemove({ slug }).exec()
        res.json({ message: "ลบข้อมูลเรียบร้อย" })
    } catch (err) {
        // Handle error here
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.update = async (req, res) =>{
    try{
        const {slug} = req.params
        //ส่งข้อมูล => title, content, author
        const {title, content, author} = req.body
        await Blogs.findOneAndUpdate({slug}, {title, content, author}, {new:true}).exec()
        res.json({ message: "แก้ไขข้อมูลเรียบร้อย" })
    }catch (err){
        //Handle error here
        console.error(err);
        res.status(500).send('Server Error')
    }
}