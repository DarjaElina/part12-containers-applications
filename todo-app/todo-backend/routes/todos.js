const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

const { getAsync, setAsync } = require('../redis/index')

const TODO_COUNTER_KEY = 'added_todos'

const incrementTodoCounter = async () => {
  await setAsync(TODO_COUNTER_KEY, (Number(await getAsync(TODO_COUNTER_KEY)) || 0) + 1)
}

const getTodoCounter = async () => {
  return Number(await getAsync(TODO_COUNTER_KEY)) || 0
}


router.get('/statistics', async (req, res) => {
  const count = await getTodoCounter()
  res.json({ added_todos: count })
});

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  await incrementTodoCounter()

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
}); 

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.todo._id,
    req.body
  )
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
