"use client";

import {useEffect, useState} from "react";
import {Tarif} from "@/types/Tarif";
import api from "@/lib/api";
import {Spin} from "antd";

export default function RateManagement() {
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await api.get<Tarif[]>("/tarif");
      setTarifs(response.data); //must use .data
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = () => {
      fetchRates().catch(console.error);
    };
    loadData();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Rate Management</h1>
      <Spin size="large" spinning={loading}></Spin>
    </>
  );
}
