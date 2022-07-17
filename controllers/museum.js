// module.exports.query =  async (req, res, next) => {
//     const [results, metadata] =  await sequelize.query('SELECT * FROM public."Hotels" ORDER BY "idHotel" ASC ');
//     return results
// }

const sequelize = require('../util/database');

module.exports = {

    query(req, res) {
        sequelize.query('SELECT * FROM public."Hotels" ORDER BY "idHotel" ASC ', { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                //return res.send({result});
                res.render('query/query', { hotels: result })
            })
    },
    home(req, res) {
        res.render('home')
    },
    object1(req, res) {
        sequelize.query('select titulo, TipoObjArt, CatObjtArt from public."objetos_arte" order by  TipoObjArt, CatObjtArt', { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                //return res.send({ result });
                res.render('object/object1', { object: result })
            })
    },
    object2(req, res) {
        sequelize.query('select  DISTINCT  on (date_part(\'year\',dataemprestimo)) date_part(\'year\',dataemprestimo) as ano, nomecolpert, count(nomecolpert) as total from public."emprestados" group by date_part(\'year\',dataemprestimo), nomecolpert   order by date_part(\'year\',dataemprestimo), count(nomecolpert) desc ', { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                //return res.send({ result });
                res.render('object/object2', { object: result })
            })
    },
    object3(req, res) {
        sequelize.query('select  DISTINCT  on (to_char(dataemprestimo,\'month\')) to_char(dataemprestimo,\'month\') AS "mes", nomecolpert, count(nomecolpert) as total from public."emprestados" group by to_char(dataemprestimo,\'month\'), nomecolpert  order by to_char(dataemprestimo,\'month\'), count(nomecolpert) desc ', { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                //return res.send({ result });
                res.render('object/object3', { object: result })
            })
    },
    object4(req, res) {
        const month = req.query.month || 1
        const year = req.query.year || 2010
        sequelize.query(`select distinct titulo, dataaquisicao, custo from Permanentes inner join Objetos_arte on Permanentes.numobj5 = Objetos_arte.numid where  date_part(\'year\', DataAquisicao) = ${year} and date_part(\'month\', DataAquisicao) = ${month} order by DataAquisicao`, { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                sequelize.query(`select date_part('year', DataAquisicao), sum(custo) from (select distinct titulo, dataaquisicao, custo from Permanentes inner join Objetos_arte on Permanentes.numobj5 = Objetos_arte.numid
                    order by DataAquisicao) as t group by date_part('year', DataAquisicao) order by date_part('year', DataAquisicao) asc`, { type: sequelize.QueryTypes.SELECT })
                    .then(values => {
                        const labels = []
                        const data = []
                        values.forEach(element => {
                            labels.push(`\'${element['date_part']}\'`)
                            data.push(parseInt(element['sum']))
                        });
                        //return res.send({values });
                        res.render('object/object4', { object: result, values: values, labels: labels, data: data })
                    })
            })
    }, object5(req, res) {
        const month = req.query.month || 1
        const year = req.query.year || 2010
        sequelize.query(`select nomecolpert, count(nomecolpert), date_part('year', dataemprestimo),to_char(dataemprestimo,'month') from Emprestados inner join Objetos_arte on Emprestados.numobj4 = Objetos_arte.numid
        where  date_part('year', dataemprestimo) = ${year} and date_part('month', dataemprestimo) = ${month}
        group by nomecolpert, date_part('year', dataemprestimo), to_char(dataemprestimo,'month')
        order by count(nomecolpert) desc
        `, { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                sequelize.query(`select nomecolpert, count(nomecolpert), date_part('year', dataemprestimo) from Emprestados inner join Objetos_arte on Emprestados.numobj4 = Objetos_arte.numid
                group by nomecolpert, date_part('year', dataemprestimo)
                order by date_part('year', dataemprestimo)`, { type: sequelize.QueryTypes.SELECT })
                    .then(values => {
                        const labels = []
                        const data = []
                        values.forEach(element => {
                            labels.push(`\'${element['nomecolpert']} - ${element['date_part']}\'`)
                            data.push(parseInt(element['count']))
                        });
                        //return res.send({ values, labels, data });
                        res.render('object/object5', { object: result, values: values, labels: labels, data: data })
                    })
            })
    }, getColecao(req, res) {
        res.render('colecao/add-colecao', {
            pageTitle: 'Add Colecao',
            path: '/colecao/add-colecao',
        })
    }, postColecao(req, res) {
        const NomeCol = req.body.NomeCol
        const DescrCol = req.body.DescrCol
        const Endereco = req.body.Endereco
        const Telefone = req.body.Telefone
        const TipoCol = req.body.TipoCol
        sequelize.query(`INSERT INTO Colecao (NomeCol, DescrCol, Endereco, Telefone, TipoCol) VALUES ('${NomeCol}', '${DescrCol}', '${Endereco}', '${Telefone}', '${TipoCol}');`, { type: sequelize.QueryTypes.INSERT })
            .then(result => {
                //return res.send({result});
                res.redirect('criar-colecao')
            }).catch(err => {
                console.log(err)
            })
    }, getObjeto(req, res) {
        res.render('objeto/add-objeto', {
            pageTitle: 'Add Objeto',
            path: '/objeto/add-objeto',
        })
    }, postObjeto(req, res) {
        const Titulo = req.body.Titulo
        const TipoObjArt = req.body.TipoObjArt
        const CatObjtArt = req.body.CatObjtArt
        sequelize.query(`INSERT INTO Objetos_arte (Titulo, TipoObjArt, CatObjtArt) VALUES ('${Titulo}', '${TipoObjArt}', '${CatObjtArt}');`, { type: sequelize.QueryTypes.INSERT })
            .then(result => {
                //return res.send({result});
                res.redirect('criar-objeto')
            }).catch(err => {
                console.log(err)
            })
    }, getPermanente(req, res) {
        sequelize.query('select numid, titulo from public."objetos_arte"', { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                //return res.send({ result });
                res.render('permanente/add-permanente', {
                    pageTitle: 'Add Permanente',
                    path: '/permanente/add-permanente',
                    result: result
                })
            })
    }, postPermanente(req, res) {
        const NumObj5 = req.body.NumObj5
        const Custo = req.body.Custo
        const DataAquisicao = req.body.DataAquisicao
        sequelize.query(`INSERT INTO Permanentes (NumObj5, Custo, DataAquisicao) VALUES (${NumObj5}, ${Custo}, '${DataAquisicao}');`, { type: sequelize.QueryTypes.INSERT })
            .then(result => {
                //return res.send({result});
                res.redirect('criar-permanente')
            }).catch(err => {
                console.log(err)
            })
    }, getEmprestado(req, res) {
        sequelize.query('select numid, titulo from public."objetos_arte"', { type: sequelize.QueryTypes.SELECT })
            .then(objeto => {
                sequelize.query('SELECT * FROM public."colecao" ORDER BY nomecol ASC ', { type: sequelize.QueryTypes.SELECT })
                    .then(colecao => {
                        //return res.send({objeto, colecao });
                        res.render('emprestado/add-emprestado', {
                            pageTitle: 'Add Emprestado',
                            path: '/emprestado/add-emprestado',
                            objeto: objeto,
                            colecao: colecao,
                        })
                    })
            })
    }, postEmprestado(req, res) {
        const NumObj4 = req.body.NumObj4
        const DataEmprestimo = req.body.DataEmprestimo
        const NomeColPert = req.body.NomeColPert
        sequelize.query(`INSERT INTO Emprestados (NumObj4, DataEmprestimo, NomeColPert) VALUES (${NumObj4}, '${DataEmprestimo}', '${NomeColPert}');`, { type: sequelize.QueryTypes.INSERT })
            .then(result => {
                //return res.send({result});
                res.redirect('criar-emprestado')
            }).catch(err => {
                console.log(err)
            })
    }

};


