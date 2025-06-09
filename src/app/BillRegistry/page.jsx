"use client";
import React, { useState } from "react";
import Entry from "../CommonComponets/Entry";
import Table from "../CommonComponets/Table";
import Ejson from "../Json/BillReg.json";
import { useRouter } from "next/navigation";

export default function BillRegistry() {
  const saveApi = "http://localhost:3000/api/BillRegistry/save";
  const SelectApi = "http://localhost:3000/api/BillRegistry/select";
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bill Registry</h1>
      <div>
        <Entry Ejson={Ejson} saveApi={saveApi} />
      </div>
      <div>
        <Table SelectApi={SelectApi} />
      </div>
    </div>
  )
}
