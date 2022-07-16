const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const { engine } = require('express-handlebars')


const bodyParser = require('body-parser')

const sequelize = require('./util/database');

app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    helpers: require('./public/helpers/handlebars.js')
}))

app.set('view engine', 'handlebars')
app.set('views', './views')


const museumRoutes = require('./routes/museum')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.use('/', museumRoutes)
// app.use('/object1', museumRoutes)
// app.use('/object2', museumRoutes)
// app.use('/object3', museumRoutes)
// app.use('/object4', museumRoutes)
// app.use('/object5', museumRoutes)
// app.use('/getColecao', museumRoutes)

sequelize.sync().then(result => {
    app.listen(port, (req, res) => {
        console.log(`Server running on localhost:${port}`)
    })
}).catch(err => {
    console.log(err)
})