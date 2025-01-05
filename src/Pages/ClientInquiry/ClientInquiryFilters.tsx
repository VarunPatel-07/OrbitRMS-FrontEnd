import React from "react";

export interface operatorObject {
  label: string;
  value: string;
}

export interface clientInquiryFiltersInterFace {
  id: string;
  label: React.ReactElement;
  operator?: Array<operatorObject>;
  options?: Array<operatorObject>;
  type: string;
}

export const clientInquiryFiltersArray: clientInquiryFiltersInterFace[] = [
  {
    id: "email",
    label: (
      <div className="flex items-start">
        <span className="icon-mail-05 text-gray-600 text-lg pe-2" />
        <span>Email</span>
      </div>
    ),
    type: "text",
    operator: [
      { label: "Equals", value: "equals" },
      { label: "Contains", value: "contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" },
    ],
    options: [], // No options for text filters
  },
  {
    id: "name",
    label: (
      <div className="flex items-start">
        <span className="icon-user text-gray-600 text-lg pe-2" />
        <span>Name</span>
      </div>
    ),
    type: "text",
    operator: [
      { label: "Equals", value: "equals" },
      { label: "Contains", value: "contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" },
    ],
    options: [], // No options for text filters
  },
  {
    id: "status",
    label: (
      <div className="flex items-start">
        <span className="icon-check-circle text-gray-600 text-lg pe-2" />
        <span>Status</span>
      </div>
    ),
    type: "select",
    operator: [
      { label: "Equals", value: "equals" },
      { label: "Not Equals", value: "not_equals" },
    ],
    options: [
      { label: "Open", value: "open" },
      { label: "Closed", value: "closed" },
    ],
  },
  {
    id: "date",
    label: (
      <div className="flex items-start">
        <span className="icon-calendar text-gray-600 text-lg pe-2" />
        <span>Date</span>
      </div>
    ),
    type: "date",
    operator: [
      { label: "Before", value: "before" },
      { label: "After", value: "after" },
      { label: "On", value: "on" },
      { label: "Between", value: "between" },
    ],
    options: [], // No predefined options for date filters
  },
  {
    id: "priority",
    label: (
      <div className="flex items-start">
        <span className="icon-flag text-gray-600 text-lg pe-2" />
        <span>Priority</span>
      </div>
    ),
    type: "select",
    operator: [
      { label: "Equals", value: "equals" },
      { label: "Not Equals", value: "not_equals" },
    ],
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  },
];
