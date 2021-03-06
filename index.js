'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const Vlog = require('./lib/vlog');



const app = express();

app.use(helmet({
  hsts: false
}));


app.use(cors({
  origin: 'https://vlogtv-test.now.sh'
}))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/vlog/:channel', (req, res) => {
  let channel = req.params.channel || 'CaseyNeistat';
  let date = new Date(req.query.date || Date.now());
  let vlog = new Vlog(channel);
  date.setUTCHours(0, 0, 0, 0);
  vlog.setDate(date, req.query.span);
  vlog.reload().then(response => {
    res.json(response);
  }, err => {
    res.status(400).end();
  });
});

app.get('*', (req, res) => {
  res.status(404).end();
});

app.listen(8001);