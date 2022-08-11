import { Fragment, useEffect, useState } from "react";
import { Table } from "reactstrap";
import { useAppSelector } from "../../../app/hooks"
import { IDictionary } from "../../../app/types";
import { customerStocksSelector } from "../customer-slice"
import { ProductStock, PRODUCT_CODES } from "../types";
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function CustomerStocks() {
    const navigate = useNavigate();
    const customerStocks = useAppSelector(customerStocksSelector);

    const [productStockSummary, setProductStockSummary] = useState<IDictionary<ProductStock>>({});

    useEffect(() => {
        let summary = {};
        PRODUCT_CODES.forEach(productCode => {
            const prodSummary: ProductStock = {
                productCode,
                remainingStock: getRemainingStokcs(productCode),
                undeliveredStock: getUndeliveredStokcs(productCode),
            };
            summary = { ...summary, [productCode]: prodSummary }
        })
        setProductStockSummary(summary);
    }, [customerStocks]);

    const getRemainingStokcs = (productCode: string) => {
        const total = customerStocks.flatMap(s => s.stocks)
            .filter(s => s.productCode === productCode)
            .map(s => s.remainingStock)
            .reduce((a, b) => a + b, 0);

        return +total.toFixed(4);
    }

    const getUndeliveredStokcs = (productCode: string) => {
        var total = customerStocks.flatMap(s => s.stocks)
            .filter(s => s.productCode === productCode)
            .map(s => s.undeliveredStock)
            .reduce((a, b) => a + b, 0);
        return +total.toFixed(4);
    }

    const handleCustomerSelect = (customerId: string) => {
        navigate({ pathname: '/entries', search: `?${createSearchParams({ customerId })}` })
    }

    return <Table bordered style={{ tableLayout: 'fixed', textAlign: 'center' }}>
        <thead>
            <tr>
                <th rowSpan={2} className="text-start">
                    Customer
                </th>
                {
                    PRODUCT_CODES.map(code => <th key={code} colSpan={2}>{code}</th>)
                }
            </tr>
            <tr>
                {
                    PRODUCT_CODES.map(code => <Fragment key={code}>
                        <th>Remaining</th>
                        <th>Undelivered</th>
                    </Fragment>)
                }
            </tr>
        </thead>
        <tbody>
            {
                customerStocks.map(customerStock => <tr key={customerStock.customerName}>
                    <th className="text-start">
                        <span style={{ cursor: 'pointer' }}
                            onClick={() => handleCustomerSelect(customerStock.customerId)}>
                            {customerStock.customerName}
                        </span>
                    </th>
                    {PRODUCT_CODES.map(productCode => {
                        const productStock = customerStock.stocks.find(s => s.productCode == productCode);
                        return <Fragment key={productCode}>
                            <td>
                                {productStock?.remainingStock}
                            </td>
                            <td>
                                {productStock?.undeliveredStock}
                            </td>
                        </Fragment>
                    })}
                </tr>)
            }
            <tr>
                <th className="text-start">
                    Totals
                </th>
                {PRODUCT_CODES.map(productCode => {
                    return <Fragment key={productCode}>
                        <th>
                            {productStockSummary[productCode]?.remainingStock.toFixed(4)}
                        </th>
                        <th>
                            {productStockSummary[productCode]?.undeliveredStock.toFixed(4)}
                        </th>
                    </Fragment>
                })}
            </tr>
            <tr>
                <th className="text-start">
                    Overall Totals
                </th>
                {PRODUCT_CODES.map(productCode => {
                    return <Fragment key={productCode}>
                        <th colSpan={2}>
                            {((productStockSummary[productCode]?.remainingStock || 0)
                                + (productStockSummary[productCode]?.undeliveredStock || 0)).toFixed(4)}
                        </th>
                    </Fragment>
                })}
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={PRODUCT_CODES.length * 2 + 1} className="text-start text-muted">
                    <i><small>*All the figures are in metric tons (MT)</small></i>
                </td>
            </tr>
        </tfoot>
    </Table>
}