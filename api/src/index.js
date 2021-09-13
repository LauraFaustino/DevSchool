import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/matricula', async (req,resp) => {
    try{
        let cadastros = await db.tb_matricula.findAll({ order: [['id_matricula', 'desc']] });
        resp.send(cadastros);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
    
});

app.post('/matricula', async (req,resp) => {
   try{
       let { nome, chamada, curso, turma } = req.body;

       let e = await db.tb_matricula.findOne({where: {nr_chamada: chamada, nm_turma: turma } })
            if (e != null){
                return resp.send({ erro: 'Aluno já existe!' })
            }
            if(!nome || nome == ''){
                return resp.send({erro: 'O campo nome é obrigatório'})
            }
            if (!curso || curso == ''){
                return resp.send({erro:'O campo curso é obrigatório'})
            }
            if (!turma || turma == ''){
                return resp.send({erro:'O campo turma é obrigatório'})
            }
            if (chamada <= 0 ) {
                return resp.send({erro:'O campo chamada deve receber um número valido'})
            }
            if(isNaN(chamada)){
                return resp.send({erro: 'Valor chamada inválido'});
            }
    

       let a = await db.tb_matricula.create({
           nm_aluno: nome,
           nr_chamada: chamada,
           nm_curso: curso,
           nm_turma: turma
       })
       resp.send(a);
   } catch (e){
       resp.send({ erro: e.toString() } )
   }
})

app.delete('/matricula/:id', async(req, resp) => {
    try{
        let { id } = req.params;

        let r = await db.tb_matricula.destroy({ where: {id_matricula: id} })
        resp.sendStatus(200);
    } catch(e){
        resp.send({ erro: e.toString() })
    }
})

app.put('/matricula/:id', async(req, resp) => {
    try{
        let { nome, chamada, curso, turma} = req.body;
            let { id } = req.params;

        let b = await db.tb_matricula.update(
            {
                nm_aluno: nome, 
                nr_chamada: chamada,
                nm_curso: curso,
                nm_turma: turma
            },
            {
                where: {id_matricula: id}
            });
            resp.sendStatus(200);
        } catch (e) {
            resp.send({ erro: e.toString() });
        }
})


app.listen(process.env.PORT,

x => console.log(`Server up at port ${process.env.PORT}`))