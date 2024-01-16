import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // Importa la función v4 de uuid

const app = express();
app.use(bodyParser.json());
app.use(cors());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return { tickets: [] }; // Devuelve un objeto con un arreglo de tickets si no hay datos existentes
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node.js!");
});

app.get("/tickets", (req, res) => {
  const data = readData();
  res.json(data.tickets);
});

app.get("/tickets/:id", (req, res) => {
  const data = readData();
  const id = req.params.id;
  const ticket = data.tickets.find((ticket) => ticket.id === id);
  res.json(ticket);
});

app.post("/tickets", (req, res) => {
  const data = readData();
  const body = req.body;
  const newTicket = {
    id: uuidv4(), // Utiliza uuid para generar un ID único
    ...body,
  };
  data.tickets.push(newTicket);
  writeData(data);
  res.json(newTicket);
});

app.put("/tickets/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = req.params.id;
  const ticketIndex = data.tickets.findIndex((ticket) => ticket.id === id);
  data.tickets[ticketIndex] = {
    ...data.tickets[ticketIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Ticket updated successfully" });
});

app.delete("/tickets/:id", (req, res) => {
  const data = readData();
  const id = req.params.id;
  const ticketIndex = data.tickets.findIndex((ticket) => ticket.id === id);
  data.tickets.splice(ticketIndex, 1);
  writeData(data);
  res.json({ message: "Ticket deleted successfully" });
});

app.listen(3006, () => {
  console.log("Server listening on port 3006");
});
