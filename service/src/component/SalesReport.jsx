import React from 'react';
import './SalesReport.css';

export const SalesReport = ({ reportData }) => {  
    return (
      <div className="sales-report-table">
      <h2>Sales Report</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Ledger Name</th>
            <th>Transaction Type</th>
            <th>Payment Type</th>
            <th>Bill Amount</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Received Amount</th>
            <th>Narration</th>
            <th>Contact No</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reportData && reportData.length > 0 ? (
            reportData.map((item) => (
              <tr key={item.Id}>
                <td>{item.Id}</td>
                <td>{item.CustomerName}</td>
                <td>{item.LedgerName}</td>
                <td>{item.TransactionType}</td>
                <td>{item.PaymentType}</td>
                <td>{item.BillAmount}</td>
                <td>{item.Discount}</td>
                <td>{item.Total}</td>
                <td>{item.ReceivedAmount}</td>
                <td>{item.Narration}</td>
                <td>{item.ContactNo}</td>
                <td>{new Date(item.Date).toLocaleDateString()}</td> {/* Corrected Date column */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
      );
    };