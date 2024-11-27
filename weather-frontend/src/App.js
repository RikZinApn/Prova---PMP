import React, { useState, useEffect } from "react";
import api from "./services/api";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch inicial dos dados do backend
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await api.get("/weather");
        console.log("Dados retornados:", response.data);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchWeatherData();
  }, []);

  //filtros por data/hora
  const applyFilters = () => {
    const filtered = data.filter((item) => {
      const itemDate = item.timestamp ? new Date(item.timestamp) : null;
      return (
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate)
      );
    });
    setFilteredData(filtered);
  };
  // const applyFilters = () => {
  //   const filtered = data.filter((item) => {
  //     const itemDate = new Date(item.timestamp.seconds * 1000); // Converte o timestamp do Firestore
  //     return (
  //       (!startDate || itemDate >= startDate) &&
  //       (!endDate || itemDate <= endDate)
  //     );
  //   });
  //   setFilteredData(filtered);
  // };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">
        Controle de Umidade e Temperatura
      </h1>

      {/* Filtros por Data/Hora */}
      <div className="flex space-x-4 mb-6">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Data Inicial"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateTimePicker
            label="Data Final"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={applyFilters}>
          Filtrar
        </Button>
      </div>

      {/* Tabela de Dados */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Data e Hora</th>
            <th className="border border-gray-300 px-4 py-2">
              Temperatura (°C)
            </th>
            <th className="border border-gray-300 px-4 py-2">Umidade (%)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })
                  : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.temperature}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.humidity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráfico de Temperatura */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">Gráfico de Temperatura</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) =>
                new Date(timestamp).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
