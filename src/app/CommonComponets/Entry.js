"use client";

import React, { useReducer } from "react";
import { Star, XCircle } from "lucide-react";

export default function Entry(props) {
    const fieldDefs = props.Ejson.fields || {};
    const initialState = Object.keys(fieldDefs).reduce((acc, key) => {
        acc[key] = "";
        return acc;
    }, {});

    const reducer = (state, action) => {
        switch (action.type) {
            case "Add":
                return { ...state, ...action.payload };
            case "ClearField":
                return { ...state, [action.payload]: "" };
            case "AllClear":
                const cleared = {};
                Object.keys(fieldDefs).forEach((key) => {
                    cleared[key] = "";
                });
                return cleared;
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(props.saveApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Response Data:", data);
            dispatch({ type: "AllClear" });
        } else {
            console.error("Error submitting form");
        }
    };

    const renderField = (field, name) => {
        const commonProps = {
            name,
            value: state[name],
            required: field.required || false,
            placeholder: `Enter ${name}` || "",
            onChange: (e) =>
                dispatch({ type: "Add", payload: { [name]: e.target.value } }),
            className:
                "w-full pr-8 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400",
        };

        return (
            <div className="relative w-full text-sm">
                {field.type === "dropdown" ? (
                    <select {...commonProps}>
                        <option value="">-- Select --</option>
                        {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                ) : field.type === "textarea" ? (
                    <textarea rows={3} {...commonProps}></textarea>
                ) : (
                    <input type={field.type || "text"} {...commonProps} />
                )}

                {state[name] && (
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "ClearField", payload: name })}
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                    >
                        <XCircle size={16} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleSubmit}
            >
                {Object.entries(fieldDefs).map(([name, field], index) => (

                    !name.endsWith('IDPK') && <div key={index} className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                                <Star
                                    className="inline-block ml-1 text-red-500"
                                    size={10}
                                    fill="red"
                                />
                            )}
                        </label>
                        {renderField(field, name)}
                    </div>
                ))}

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-md"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "AllClear" })}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-md"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
