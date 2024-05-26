import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

const app = express()
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (_, res: Response) => {
    res.send('Hello, World!')
})

app.post('/:to', (req: Request, res: Response) => {
    const { to } = req.params
    const { name, email, subject, message } = req.body

    console.log(req)

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

    const text = `
Nome: ${name}
Email: ${email}
Mensagem: ${message}
`

    const mailOptions: Mail.Options = {
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
            const refererURL = req.get('referer')
            
            if (refererURL) {
                res.redirect(refererURL)
            }

            res.status(200).send('Email enviado com sucesso')
        }
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
