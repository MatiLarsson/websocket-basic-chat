import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io'

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
})
const io = new Server(server);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

let log = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('newUser');
  socket.on('message', (data) => {
    log.push(data);
    io.emit('log', log);
  });
});