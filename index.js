const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joaorocha',
  password: 'ds564',
  port: 7007,
});

const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = dataNascimento.getMonth();
  if (mesNascimento > mesAtual || (mesNascimento === mesAtual && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
}

// function padronizarELimparData(data) {
//   let limparData = data.split('-').reverse().join('/');
//   return limparData;
// }

const calcularSigno = (mes, dia) => {
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
    return 'Aquário';
  } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
    return 'Peixes';
  } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
    return 'Áries';
  } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
    return 'Touro';
  } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
    return 'Gêmeos';
  } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
    return 'Câncer';
  } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
    return 'Leão';
  } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
    return 'Virgem';
  } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
    return 'Libra';
  } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
    return 'Escorpião';
  } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
    return 'Sagitário';
  } else {
    return 'Capricórnio';
  }
}

app.get('/signos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM signos');
    res.json({
        total: result.rowCount,
        usuarios: result.rows,
    });
  } catch (error) {
    console.error( 'Erro ao obter os usuarios:', error);
    res.status(500).send({mensagem: 'Erro ao obter os usuarios:', erro: error});
  }
});

app.get('/signos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM signos WHERE id = $1', [id]);
    if (resultado.rowCount == 0) {
      res.status(404).send({ mensagem: 'Usuário inexistentes' });
    } else {
      res.json(resultado.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao procurar o ID:', error);
    res.status(500).send('Erro ao procurar o ID');
  }
});

app.post('/signos', async (req, res) => {
  try {
    let {nome, email, datanascimento, status, sexo} = req.body;
      const dataNascimento = new Date();
      const idade = calcularIdade(dataNascimento);
      const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());
      // datanascimento = padronizarELimparData(datanascimento);

      await pool.query('INSERT INTO signos (nome, email, idade, signo, datanascimento, status, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nome, email, idade, signo, datanascimento, status, sexo]);
      res.status(201).send({ mensagem: 'Usuário Criado'});
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário');
  }
});

app.delete('/signos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM signos WHERE id = $1', [id]);
    res.status(201).send({ mensagem: 'Usuário deletado'});
  } catch (error) {
    console.error('Erro ao deletar o usuário:', error);
    res.status(500).send('Erro ao deletar o usuário');
  }
});

app.put('/signos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, datanascimento, status, sexo } = req.body;
    const dataNascimento = new Date(datanascimento);
    const idade = calcularIdade(dataNascimento);
    const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());
    await pool.query('UPDATE signos SET nome = $1, email = $2, idade = $3, signo = $4, datanascimento = $5, status = $6, sexo = $7 WHERE id = $8', [nome, email, idade, signo, datanascimento, status, sexo, id]);
    res.status(200).send({ mensagem: 'Usuário atualizado'});
  } catch (error) {
    console.log('Erro ao atualizar usuário:', error);
    res.status(500).send({mensagem:'Erro ao tentar atualizar o usuário', error})
  }
});

app.get( '/', (req, res) => {
  res.send({ message: 'Servidor On 👻' });
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  });