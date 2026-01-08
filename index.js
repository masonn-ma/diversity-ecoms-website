const express = require('express');
const path = require('path');
const app = express();
const env = require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { Schema } = mongoose;
const router = express.Router();
const moment = require('moment');
let siteList = [];

// ---------------------------------------
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// ---------------------------------------

mongoose.connect(process.env.DATABASECONNECT) // Database connection
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.log(error.message));

// Set the engine view to ejs
app.set('view engine', 'ejs')
app.set("views", "./views");

app.use(express.urlencoded({ extended: true })); // Parse data from forms

app.use(cookieParser()); // Cookie-parser middleware

app.use(express.static('public')); // Connection to 'public' folder

app.listen(process.env.PORT, () => { // Open server
  console.log(`Example app listening on port ${process.env.PORT}. Open website: http://localhost:${process.env.PORT}/`)
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------- UPLOADING IMGS -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/profileImg/'); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, req.cookies.userId + path.extname(file.originalname));
  }
});

// Define the file filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
    cb(new Error('Only .jpeg or .png files are allowed!'));
  }
};

const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/postImg/'); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const storageComment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/commentImg/'); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage and fileFilter options
const upload = multer({ storage: storage, fileFilter });
const uploadPost = multer({ storage: storagePost, fileFilter });
const uploadComment = multer({ storage: storageComment, fileFilter });

// app.use('/profileImg', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('myFile'), async (req, res) => {
  const userId = req.cookies.userId;
  const userFromDb = await User.findById({ _id: userId }).populate('details').exec();

  // console.log(userFromDb.details[0].img);

  userFromDb.details[0].img = `/profileImg/${req.file.filename}`;

  await userFromDb.details[0].save();

  res.redirect('/settings');
});

app.post('/create-post', uploadPost.single('postImage'), async (req, res) => {
  const data = req.body;
  const userId = req.cookies.userId;
  const username = req.cookies.username;

  console.log('create-post', data);

  console.log(data);
  console.log(data.createPostTitle);

  if (req.file) {
    const newPost = (new ForumPost({
      userId: userId,
      username: username,
      title: data.createPostTitle,
      content: data.createPostContent,
      thread: data.thread,
      img: `/postImg/${req.file.filename}`
    }));
    await newPost.save();
  } else {
    const newPost = (new ForumPost({
      userId: userId,
      username: username,
      title: data.createPostTitle,
      content: data.createPostContent,
      thread: data.thread,
    }));
    await newPost.save();
  }
  res.redirect('/forums');
});

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------- DATABASE ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

const userDetails = new mongoose.Schema({
  img: {
    type: String,
    required: false,
    default: '/profileImg/default.jpg'
  },
  darkMode: {
    type: Boolean,
    required: false,
    default: false
  },
  admin: {
    type: Boolean,
    required: false,
    default: false
  },
  deactivate: {
    type: Boolean,
    required: false,
    default: false
  },
  pin: {
    type: Number,
    max: 4,
    required: false
  }
});

const userAddress = new mongoose.Schema({
  house_num: {
    type: Number,
    required: false
  },
  street_name: {
    type: String,
    required: false
  },
  province: {
    type: String,
    required: false
  },
  district: {
    type: String,
    required: false
  },
  ward: {
    type: String,
    required: false
  },
  postal_code: {
    type: String,
    required: false
  }
});

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  products: [
    new Schema({
      name: String,
      price: Number,
      quantity: Number,
      type: String,
      img: String,
      refId: String
    })
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  products: [
    new Schema({
      name: String,
      price: Number,
      quantity: Number,
      type: String,
      img: String,
    })
  ]
});

const userSchema = new mongoose.Schema({ // User schema
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pNo: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  details: [{ type: Schema.Types.ObjectId, ref: 'details' }],
  address: [{ type: Schema.Types.ObjectId, ref: 'address' }],
  cart: [{ type: Schema.Types.ObjectId, ref: 'cart' }]
});

const prodSchema = new mongoose.Schema({ // Product schema
  name: String,
  price: {
    type: Number,
    default: 100
  },
  qty: {
    type: Number,
    default: 10
  },
  color: {
    type: String,
    enum: ['red', 'blue', 'yellow', 'black', 'white', 'green', 'pink']
  },
  type: {
    type: String,
    enum: ['pants', 'shirt', 'shoes']
  },
  img: String,
  trending: {
    type: Boolean,
    default: false
  },
  desc: {
    type: String,
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
});
prodSchema.index({ name: 'text' });

const commentSchema = new mongoose.Schema({ // Comments schema
  userId: String,
  postId: { type: Schema.Types.ObjectId, ref: 'posts' },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'comments',
    default: null,
    required: false, // if not populated, then its a top level comment
  },
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  likeCount: {
    type: Number,
    default: 0
  },
  likes: [{ type: Schema.Types.ObjectId }],
  deleted: {
    type: Boolean,
    default: false
  },
  img: String,
}, { timestamps: true });

const postSchema = new mongoose.Schema({ // Post schema
  userId: String,
  username: String,
  title: String,
  content: String,
  img: String,
  likeCount: {
    type: Number,
    default: 0
  },
  likes: [{ type: Schema.Types.ObjectId }],
  commentCount: {
    type: Number,
    default: 0
  },
  thread: {
    type: String,
    enum: ['general', 'news', 'clothes', 'shoes'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
postSchema.virtual('timeAgo').get(function () {
  return moment(this.createdAt).fromNow();
});
postSchema.index({ title: 'text', content: 'text' });

const User = mongoose.model('user', userSchema);
const Prod = mongoose.model('product', prodSchema);
const Details = mongoose.model('details', userDetails);
const Address = mongoose.model('address', userAddress);
const Cart = mongoose.model('cart', cartSchema);
const History = mongoose.model('history', historySchema);

const Comment = mongoose.model('comments', commentSchema);
const ForumPost = mongoose.model('posts', postSchema);

const blackShirt = new Prod({
  name: `Black shirt`,
  color: 'black',
  type: 'shirt',
  img: '/img/products/shirt/black-shirt.png',
  trending: true,
})
const whiteShirt = new Prod({
  name: `White shirt`,
  color: 'white',
  type: 'shirt',
  img: '/img/products/shirt/white-shirt.png'
})
const yellowShirt = new Prod({
  name: `Yellow shirt`,
  color: 'yellow',
  type: 'shirt',
  img: '/img/products/shirt/yellow-shirt.png',
  trending: true,
})
const bluePants = new Prod({
  name: `Blue pants`,
  color: 'blue',
  type: 'pants',
  img: '/img/products/pants/blue-pants.png'
})
const blackPants = new Prod({
  name: `Black pants`,
  color: 'black',
  type: 'pants',
  img: '/img/products/pants/black-pants.png',
  trending: true,
})
const whitePants = new Prod({
  name: `White pants`,
  color: 'white',
  type: 'pants',
  img: '/img/products/pants/white-pants.png',
  trending: true,
})
const greenSneakers = new Prod({
  name: `Green sneakers`,
  color: 'green',
  type: 'shoes',
  img: '/img/products/sneakers/green-sneakers.png'
})
const pinkSneakers = new Prod({
  name: `Pink sneakers`,
  color: 'pink',
  type: 'shoes',
  img: '/img/products/sneakers/pink-sneakers.png',
})
const redSneakers = new Prod({
  name: `Green sneakers`,
  color: 'red',
  type: 'shoes',
  img: '/img/products/sneakers/red-sneakers.png'
})
const yellowSneakers = new Prod({
  name: `Yellow sneakers`,
  color: 'yellow',
  type: 'shoes',
  img: '/img/products/sneakers/yellow-sneakers.png',
})

// blackShirt.save();
// whiteShirt.save();js

// yellowShirt.save();
// bluePants.save();
// blackPants.save();
// whitePants.save();
// greenSneakers.save();
// pinkSneakers.save();
// redSneakers.save();
// yellowSneakers.save();

// ------------------------------------------------------------------------------------------- //
// ------------------------------------ RENDERING PAGES -------------------------------------- //
// ------------------------------------------------------------------------------------------- //
// const home = require('./routes/landing');
// const aboutus = require('./routes/aboutus');

// app.use('/', home);
// app.use('/about-us', aboutus)

app.get('/admin', async (req, res) => {
  const userName = req.cookies.username;
  const userId = req.cookies.userId;
  const darkMode = req.cookies.darkmode;

  const users = await User.find().populate('details').exec();
  const userAdmin = await User.findById({ _id: userId }).populate('details', 'admin').exec();
  const postList = await ForumPost.find();
  const commentList = await Comment.find();

  if (userAdmin.details[0].admin === true) {
    res.render('site/admin', { username: userName, dark: darkMode, userList: users, postList: postList, commentList: commentList });
  } else {
    res.redirect('/')
  }
});

app.get('/', async (req, res) => { // Landing page
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const prodFromDb = await Prod.find({ trending: true });
  res.render('site/index', { username: userName, prodList: prodFromDb, dark: darkMode });
});

app.get('/category', async (req, res) => { // Category
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const data = req.query;
  // console.log(data);

  var query = {};
  if (data.color) {
    query.color = data.color;
  }
  if (data.type) {
    query.type = data.type;
  }

  if (data.highest && data.lowest) {
    let highestIn;
    let lowestIn;
    if (data.highest !== '' && data.lowest !== '') {
      if (parseInt(data.highest) < parseInt(data.lowest)) {
        highestIn = data.lowest;
        lowestIn = data.highest;
      } else {
        highestIn = data.highest;
        lowestIn = data.lowest;
      }
    } else {
      highestIn = 100;
      lowestIn = 1;
    }
    query.price = { $gte: lowestIn, $lte: highestIn };
  }

  if (data.search && data.search !== '') {
    query.$and = query.$and || [];
    query.$and.push({ $text: { $search: data.search } });
  }

  // console.log(query);

  const prodList = await Prod.find(query);

  res.render('site/category', { username: userName, dark: darkMode, prodList: prodList });
});

app.get('/forums', async (req, res) => {
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const userId = req.cookies.userId;
  const data = req.query;


  var query = {};
  var querySort = { createdAt: -1 };

  if (data.filter) {
    query.thread = data.filter;
  }

  if (data.timeSorting) {
    if (data.timeSorting === 'most') {
      querySort.likeCount = -1;
    } else if (data.timeSorting === 'least') {
      querySort.likeCount = 1;
    } else if (data.timeSorting === 'latest') {
      querySort.createdAt = -1;
    } else if (data.timeSorting === 'oldest') {
      querySort.createdAt = 1;
    }
  }

  if (data.search && data.search !== '') {
    query.$text = { $search: data.search };
  }

  query.deleted = false;
  const posts = await ForumPost.find(query).sort(querySort);

  res.render('site/forums', { username: userName, userId: userId, dark: darkMode, posts: posts });
});

app.get('/forums', async (req, res) => {
  try {
    const posts = await ForumPost.find({ deleted: false }).sort({ createdAt: -1 });
    res.render('forums', { posts: posts });
  } catch (error) {
    res.status(500).send("Error retrieving forum posts.");
  }
});
app.get('/post/:id', async (req, res) => { // Item template
  const postId = req.params.id;
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const userId = req.cookies.userId;

  const post = await ForumPost.findById({ _id: postId });
  const comments = await Comment.find({ postId: postId, deleted: false }).sort({ createdAt: -1 });

  res.render('site/post', { username: userName, userId: userId, dark: darkMode, post: post, comments: comments });
});

app.post('/delete-post', async (req, res) => {
  const data = req.body;

  await ForumPost.findByIdAndUpdate({ _id: data.postId }, { deleted: true });
  res.redirect('back');
});

app.post('/delete-comment', async (req, res) => {
  const data = req.body;

  await Comment.findByIdAndUpdate({ _id: data.commentId }, { deleted: true });
  res.redirect('back');
});

app.post('/restore-post', async (req, res) => {
  const data = req.body;

  await ForumPost.findByIdAndUpdate({ _id: data.postId }, { deleted: false });
  res.redirect(req.headers.referer);
});

app.post('/restore-comment', async (req, res) => {
  const data = req.body;

  await Comment.findByIdAndUpdate({ _id: data.commentId }, { deleted: false });
  res.redirect(req.headers.referer);
});

app.get('/like-post/:id', async (req, res) => {
  const userId = req.cookies.userId;
  const postId = req.params.id;

  const post = await ForumPost.findOne({ _id: postId });

  if (post) {
    await ForumPost.findOneAndUpdate(
      {
        "_id": post._id,
        "likes": { "$ne": userId }
      },
      {
        "$inc": { "likeCount": 1 },
        "$push": { "likes": userId }
      }
    )
  }
  res.redirect(`/forums#post-${postId}`);
});

app.get('/remove-like/:id', async (req, res) => {
  const userId = req.cookies.userId;
  const postId = req.params.id;

  const post = await ForumPost.findOne({ _id: postId });

  if (post) {
    await ForumPost.findOneAndUpdate(
      {
        "_id": post._id,
        "likes": userId
      },
      {
        "$inc": { "likeCount": -1 },
        "$pull": { "likes": userId }
      }
    )
  }
  res.redirect(`/forums#post-${postId}`);
});

app.post('/add-comment/:id/:commentid', uploadComment.single('commentImg'), async (req, res) => {
  const data = req.body;
  const postId = req.params.id;
  const parentComment = req.params.commentid === "null" ? null : req.params.commentid;
  const userId = req.cookies.userId;
  const username = req.cookies.username;


  if (parentComment === null) {
    if (req.file) {
      const newComment = await (new Comment({
        userId: userId,
        postId: postId,
        author: username,
        content: data.commentField,
        img: `/commentImg/${req.file.filename}`
      })).save();
    } else {
      const newComment = await (new Comment({
        userId: userId,
        postId: postId,
        author: username,
        content: data.commentField,
      })).save();
    }
  } else {
    if (req.file) {
      const newComment = await (new Comment({
        userId: userId,
        postId: postId,
        parentCommentId: parentComment,
        author: username,
        content: data.commentField,
        img: `/commentImg/${req.file.filename}`
      })).save();
    } else {
      const newComment = await (new Comment({
        userId: userId,
        postId: postId,
        parentCommentId: parentComment,
        author: username,
        content: data.commentField,
      })).save();
    }
  }


  await ForumPost.findByIdAndUpdate({ _id: postId }, { "$inc": { "commentCount": 1 } })
  // console.log(`/post/${postId}`);
  res.redirect(`/post/${postId}`);
});

app.get('/add-comment-like/:id', async (req, res) => {
  const userId = req.cookies.userId;
  const commentId = req.params.id;

  const commentFromDb = await Comment.findById({ _id: commentId });
  const postFromDb = await ForumPost.findById({ _id: commentFromDb.postId })

  if (commentFromDb) {
    await Comment.findOneAndUpdate(
      {
        "_id": commentId,
        "likes": { "$ne": userId }
      },
      {
        "$inc": { "likeCount": 1 },
        "$push": { "likes": userId }
      }
    )
  }
  res.redirect(`/post/${postFromDb._id}`);
});

app.get('/remove-comment-like/:id', async (req, res) => {
  const userId = req.cookies.userId;
  const commentId = req.params.id;

  const commentFromDb = await Comment.findById({ _id: commentId });
  const postFromDb = await ForumPost.findById({ _id: commentFromDb.postId })

  if (commentFromDb) {
    await Comment.findOneAndUpdate(
      {
        "_id": commentId,
        "likes": userId
      },
      {
        "$inc": { "likeCount": -1 },
        "$pull": { "likes": userId }
      }
    )
  }
  res.redirect(`/post/${postFromDb._id}`);
});

app.get('/about-us', (req, res) => { // About us
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  res.render('site/aboutus', { username: userName, dark: darkMode });
});

app.get('/help', (req, res) => { // Help
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  res.render('site/help', { username: userName, dark: darkMode });
});

app.get('/created-account', (req, res) => { // Account confirmation
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  res.render('site/createdAcc', { username: userName, dark: darkMode });
});

app.get('/shopping-cart', async (req, res) => { // Shopping cart
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const userId = req.cookies.userId;
  const userCart = await Cart.findOne({ userId: userId });
  if (userCart) {
    const prodList = userCart.products;
    res.render('site/cart', { username: userName, dark: darkMode, prodList: prodList });
  } else {
    res.redirect('/login');
  }

});

app.get('/delete-item/:id', async (req, res) => {
  const itemId = req.params.id;
  const userId = req.cookies.userId;
  const userCart = await Cart.findOne({ userId: userId });
  const prodList = userCart.products;

  let indexRemove = 0;
  prodList.forEach(function (item, index) {
    if (String(userCart.products[index]._id) === itemId) {
      indexRemove = index;
    }
  });
  userCart.products.splice(indexRemove, 1);
  await userCart.save();
  res.redirect('/shopping-cart');
});

app.get('/product/:id', async (req, res) => { // Item template
  const prodId = req.params.id;
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const userId = req.cookies.userId;

  const prodFromDb = await Prod.findById({ _id: prodId });
  const similarProd = await Prod.find({
    $and: [
      { _id: { $ne: prodId } },
      { type: prodFromDb.type }
    ]
  })
    .limit(3);
  
  if (prodFromDb) {
    res.render('site/item-template', { username: userName, userId: userId, dark: darkMode, prod: prodFromDb, similar: similarProd });
  } else {
    res.redirect('/error');
  }
});

app.post('/product/:id', async (req, res) => { // Item template
  const prodId = req.params.id;
  const data = req.body;
  const userId = req.cookies.userId;

  const userCart = await Cart.findOne({ userId: userId }); // Get cart data of current user.
  const product = await Prod.findById({ _id: prodId });
  const prodList = userCart.products;

  const prodExists = await Cart.findOne({
    $and: [
      { userId: userId },
      { products: { $elemMatch: { refId: prodId } } }
    ]
  });

  if (prodExists !== null) {
    prodList.forEach(async function (item, index) {
      if (item.refId === prodId) {
        console.log(prodExists.products[index].quantity);
        prodExists.products[index].quantity = parseInt(prodExists.products[index].quantity) + parseInt(data.quantityInput);
        await prodExists.save();
      }
    })
  } else {
    const newProd = {
      name: product.name,
      price: product.price,
      type: product.type,
      quantity: data.quantityInput,
      img: product.img,
      refId: prodId,
    }
    userCart.products.push(newProd);

    await userCart.save();
  }

  // console.log(prodExists);
  // console.log(prodId);
  // console.log(data);

  res.redirect(`/product/${prodId}`);
});

app.get('/checkout', async (req, res) => { // Checkout
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const userId = req.cookies.userId;
  const userCart = await Cart.findOne({ userId: userId });
  if (userCart) {
    if (userCart.products.length !== 0) {
      const prodList = userCart.products;
      res.render('site/checkout', { username: userName, dark: darkMode, prodList: prodList });
    } else {
      res.redirect('/shopping-cart');
    }
  } else {
    res.redirect('/login');
  }
});

app.post('/checkout', async (req, res) => { // Checkout
  const userId = req.cookies.userId;
  const userCart = await Cart.findOne({ userId: userId });

  const newHistory = await (new History({
    userId: userId,
    products: userCart.products,
  })).save()
    .then(async () => {
      userCart.products = [];
      await userCart.save();
      res.redirect('/');
    })
    .catch(error => res.send(error));
});

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- PROFILE ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //


app.get('/settings', async (req, res) => { // Profile
  const userName = req.cookies.username;
  const userId = req.cookies.userId;
  const darkMode = req.cookies.darkmode;

  const userFromDb = await User.findOne({ _id: userId }).populate('details').exec();

  if (userId) {
    res.render('site/settings', {
      username: userName,
      img: userFromDb.details[0].img,
      valName: userFromDb.name,
      valEmail: userFromDb.email,
      valPassword: userFromDb.password,
      valPhone: userFromDb.pNo,
      admin: userFromDb.details[0].admin,
      dark: darkMode,
      twoStep: userFromDb.details[0].pin,
      userId: userId
    });
  } else {
    res.redirect('/error');
  }
});

app.post('/settings/info', async (req, res) => { // Backend logic for profile
  const userId = req.cookies.userId;
  const data = req.body; // Get data from forms
  const userFromDb = await User.findById({ _id: userId });

  if (data.username !== '') {
    userFromDb.name = data.username;
  }
  if (data.email !== '') {
    userFromDb.email = data.email;
  }
  if (data.password !== '') {
    userFromDb.password = data.password;
  }
  if (data.phoneNum !== '') {
    userFromDb.pNo = data.phoneNum;
  }

  await userFromDb.save();
  res.cookie('username', userFromDb.name, { maxAge: 86400000, httpOnly: true });
  res.redirect('/settings');
});

app.post('/settings/mode', async (req, res) => {
  const userId = req.cookies.userId;
  const data = req.body; // Get data from forms
  const userFromDb = await User.findOne({ _id: userId }).populate('details', 'darkMode').exec();

  if (data.dark === 'on') {
    userFromDb.details[0].darkMode = true;
  } else {
    userFromDb.details[0].darkMode = false;
  }

  await userFromDb.details[0].save();
  res.cookie('darkmode', userFromDb.details[0].darkMode, { maxAge: 86400000, httpOnly: true });
  res.redirect('/settings');
});

app.post('/settings/deactivate', async (req, res) => {
  const userId = req.cookies.userId;
  const data = req.body;
  const userFromDb = await User.findById({ _id: data.lock }).populate('details', 'deactivate').exec();
  const userDifferent = await User.findById({ _id: userId }).populate('details', 'admin');

  if (userId === data.lock) {
    userFromDb.details[0].deactivate = true;
    await userFromDb.details[0].save();
    res.redirect('/logout');
  } else if (userDifferent.details[0].admin === true) {
    userFromDb.details[0].deactivate = true;
    await userFromDb.details[0].save();
    res.redirect('/admin');
  } else {
    res.redirect('/');
  }
});

app.post('/settings/activate', async (req, res) => {
  const userId = req.cookies.userId; // Logged in account id
  const data = req.body; // Id to activate

  if (userId) {
    const userReq = await User.findById({ _id: userId }).populate('details', 'admin').exec();
    if (userReq.details[0].admin === true) {
      const userActivate = await User.findById({ _id: data.unlock }).populate('details', 'deactivate').exec();

      userActivate.details[0].deactivate = false;
      await userActivate.details[0].save();
      res.redirect('/admin');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/address-book', async (req, res) => { // Profile
  const userName = req.cookies.username;
  const userId = req.cookies.userId;
  const darkMode = req.cookies.darkmode;

  const userFromDb = await User.findOne({ _id: userId }).populate('details').exec();

  if (userId) {
    res.render('site/address', {
      username: userName,
      img: userFromDb.details[0].img,
      admin: userFromDb.details[0].admin,
      dark: darkMode
    });
  } else {
    res.redirect('/error');
  }
});

app.get('/history', async (req, res) => { // Profile
  const userName = req.cookies.username;
  const userId = req.cookies.userId;
  const darkMode = req.cookies.darkmode;

  const userFromDb = await User.findOne({ _id: userId }).populate('details').exec();

  const userHistory = await History.find({ userId: userId });

  if (userId) {
    res.render('site/history', {
      username: userName,
      img: userFromDb.details[0].img,
      admin: userFromDb.details[0].admin,
      dark: darkMode,
      history: userHistory,
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/manage-post', async (req, res) => { // Profile
  const userName = req.cookies.username;
  const userId = req.cookies.userId;
  const darkMode = req.cookies.darkmode;

  const userFromDb = await User.findOne({ _id: userId }).populate('details').exec();

  const postList = await ForumPost.find({ userId: userId, deleted: false });
  const commentList = await Comment.find({ userId: userId, deleted: false });

  if (userId) {
    res.render('site/manage-post', {
      username: userName,
      img: userFromDb.details[0].img,
      admin: userFromDb.details[0].admin,
      dark: darkMode,
      postList: postList,
      commentList: commentList
    });
  } else {
    res.redirect('/login');
  }
});

// ------------------------------------------------------------------------------------------- //
// ---------------------------------- USER AUTHENTICATION ------------------------------------ //
// ------------------------------------------------------------------------------------------- //

app.get('/signup', (req, res) => { // Signup
  res.render('site/signup', {
    username: '',
    errorName: false,
    errorNameVal: ``,
    inputNameVal: '',
    errorEmail: false,
    errorEmailVal: ``,
    inputEmailVal: '',
    errorPass: false,
    errorPassVal: ``,
    inputPassVal: '',
    errorRetype: false,
    errorRetypeVal: ``,
    inputRetypeVal: '',
    dark: 'false'
  });
});

app.post('/signup', async (req, res) => { // Backend logic -> signup page
  const data = req.body;
  const userFromDb = await User.findOne({ email: data.email });

  // Input validation
  let errName = false;
  let errNameVal = '';
  let errEmail = false;
  let errEmailVal = '';
  let errPass = false;
  let errPassVal = '';
  let errRetype = false;
  let errRetypeVal = '';

  if (data.username === '') {
    errName = true;
    errNameVal = `Username cannot be empty.`;
  }

  if (data.email === '') {
    errEmail = true;
    errEmailVal = `Email cannot be empty.`;
  } else if (userFromDb !== null) {
    errEmail = true;
    errEmailVal = `Email already in use.`;
  }

  let passStrength = 0;
  const regex = /^(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9]+$/;

  if (data.password.length >= 8) {
    passStrength++;
  }

  if ((data.password !== (data.password).toLowerCase()) && (data.password !== (data.password.toUpperCase()))) {
    passStrength++;
  }

  if (regex.test(data.password)) {
    passStrength++;
  }

  if (data.password === '') {
    errPass = true;
    errPassVal = `Password cannot be empty.`;
  } else if (passStrength < 3) {
    errPass = true;
    errPassVal = `Password too weak.`;
  }

  if (data.password !== data.retype) {
    errRetype = true;
    errRetypeVal = `Passwords must be matching.`
  }

  // Processing 
  if (!errName && !errEmail && !errPass && !errRetype) {
    const newUserDetails = await (new Details({
    })).save()
      .catch(error => res.send(error));

    const newUserAddress = await (new Address({
    })).save()
      .catch(error => res.send(error));

    const newUserCart = await (new Cart({
    })).save()
      .catch(error => res.send(error));

    const newUser = new User({
      name: data.username,
      email: data.email,
      password: data.password,
      details: [newUserDetails._id],
      address: [newUserAddress._id],
      cart: [newUserCart._id]
    });

    await newUser.save()
      .catch(error => res.send(error));

    newUserCart.userId = newUser._id;
    await newUserCart.save();

    res.redirect('/created-account')

  } else {
    res.render('site/signup', {
      username: '',
      errorName: errName,
      errorNameVal: errNameVal,
      inputNameVal: data.username,
      errorEmail: errEmail,
      errorEmailVal: errEmailVal,
      inputEmailVal: data.email,
      errorPass: errPass,
      errorPassVal: errPassVal,
      inputPassVal: data.password,
      errorRetype: errRetype,
      errorRetypeVal: errRetypeVal,
      inputRetypeVal: data.retype,
      dark: ''
    });
  }
});

app.get('/login', async (req, res) => { // Login
  const userId = req.cookies.userId;
  if (userId) {
    res.redirect('/settings');
  } else {
    res.render('site/login', {
      username: '',
      valueEmail: '',
      error: false,
      dark: false
    });
  }
});

app.post('/login', async (req, res) => { // Backend logic -> login page
  const data = req.body;
  const userFromDb = await User.findOne({ email: data.email }).populate('details').exec();

  if (userFromDb !== null && (userFromDb.password === data.password) && (userFromDb.details[0].deactivate === false)) {
    res.cookie('userId', userFromDb._id, { maxAge: 86400000, httpOnly: true });
    res.cookie('username', userFromDb.name, { maxAge: 86400000, httpOnly: true });
    res.cookie('darkmode', userFromDb.details[0].darkMode, { maxAge: 86400000, httpOnly: true });
    res.redirect('/');
  } else {
    res.render('site/login', {
      username: '',
      valueEmail: '',
      error: true,
      dark: false
    });
  }
});

app.get('/logout', (req, res) => { // Logout
  res.clearCookie('userId');
  res.clearCookie('username');
  res.clearCookie('darkmode');
  res.redirect('/');
});

app.get('/forgot-password', (req, res) => {
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;

  res.render('site/forgot-password', { username: userName, dark: darkMode, errorMessage: '' });
});

app.post('/forgot-password', async (req, res) => {
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const data = req.body;
  const userFromDb = await User.findOne({ email: data.email });
  // var fullUrl = req.protocol + '://' + req.get('host');
  // console.log(fullUrl);

  // send mail with defined transport object
  if (userFromDb) {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: data.email, // list of receivers
      subject: "Forgot password - Diversity Store", // Subject line
      html: // html body
        `
      <b>
        <h1>Hello, ${userFromDb.name}</h1>
        <p>You seem to have forgotten your password. That's unfortunate. Hya why you so noob huh? Anyways heres your password:</P>
        <p>Password: ${userFromDb.password}</p>
      </b>
      `,
    });
    res.redirect('/');
  } else {
    res.render('site/forgot-password', { username: userName, dark: darkMode, errorMessage: `An email has been sent if your account exists.` });
  }

  // console.log("Message sent: %s", info.messageId);
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ ERROR PAGE ------------------------------------- //
// ------------------------------------------------------------------------------------------- //
app.get('/sitemap', (req, res) => {
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  const admin = req.cookies.admin;
  res.render('site/sitemap', { username: userName, dark: darkMode, siteList: siteList, admin: admin });
});

app.get('/error', (req, res) => {
  const userName = req.cookies.username;
  const darkMode = req.cookies.darkmode;
  res.render('site/errorPage', { username: userName, dark: darkMode });
});

app.use(function (req, res) {
  res.status(404).redirect('/error');
});

app._router.stack.forEach(function (r) {
  if (r.route) {
    // console.log(r.route.stack[0].method );

    if (r.route.path && r.route.stack[0].method === 'get' && !(r.route.path.includes(':'))) {

      siteList.push(r.route.path);
      // console.log(r.route.path);
    }
  }
})

// TODO: (Low Priority) Optimize logic for user authentication.
// TODO: (Low Priority) Code cleanup.
// TODO: Aria

/*
#  Greetings,
#
#    I just wanna say that even though we couldn't achieve 100% of what we had original planned, we still gave it our best shot and
#    honestly speaking, I'm quite satisfied with the end result even though there are areas which could be improved. Thoughout the weeks 
#    of working on the project, my overall skills have drastically improved as a result of all the research I've done, along with the 
#    guidance of Mr. Phuc. So personally speaking, this website serves as a big milestone in my career. I'm not sure if anyone is even
#    going to find this message but to whoever is read this; I hope you have a great day and thank you for reading.
#
#  Signed, 
#  Mason
#
#  1:09 AM - 30/05/2024, Ho Chi Minh City, Vietnam
*/

