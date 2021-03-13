const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET","PUT", "POST",'DELETE'],
}

//session options

var app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//app.use(cookieParser());
// view engine setup
console.log("here")
app.use('/', indexRouter);
app.use('/user', userRouter);     

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
  
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


app.listen('1234', function (err) {
    console.log("listening on port 1234");
    if(err){
        throw err;
    }
})

module.exports = app;