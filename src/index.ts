import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import nodemailer from 'nodemailer'

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.get('/', (_, res: Response) => {
    res.send('Hello, World!')
})

app.post('/:to', (req: Request, res: Response) => {
    const { to } = req.params
    const { subject, text } = req.body

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    })

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            res.status(500).send('Erro ao enviar o email')
        } else {
            console.log('Email enviado: ' + info.response)
            res.status(200).send('Email enviado com sucesso')
        }
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
