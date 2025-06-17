"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Entry from "../../CommonComponets/Entry";
import Table from "../../CommonComponets/Table";
import Ejson from "../../Json/BillReg.json";

export default function BillRegistry() {
  const { section } = useParams();
  const Section = section || "Entry";
  const SectionComponent = Section === "Entry" ? Entry : Table;
  const saveApi = "/api/BillRegistry/save";
  const SelectApi = "/api/BillRegistry/select";
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Bill Registry</h1>
      <div>
        <SectionComponent Ejson={Ejson} saveApi={saveApi} />
      </div>
      <div>
      </div>
    </div>
  )
}
