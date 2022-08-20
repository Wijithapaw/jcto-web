import { Fragment, useEffect, useState } from "react";
import { Table } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { IDictionary } from "../../../app/types";
import { customerStocksSelector, getCustomerStocksAsync } from "../customer-slice"
import { ProductStock, PRODUCT_CODES } from "../types";
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function CustomerStocks() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const customerStocks = useAppSelector(customerStocksSelector);

    const [productStockSummary, setProductStockSummary] = useState<IDictionary<ProductStock>>({});

    useEffect(() => {
        dispatch(getCustomerStocksAsync());
    }, [])

    useEffect(() => {
        let summary = {};
        PRODUCT_CODES.forEach(productCode => {
            const prodSummary: ProductStock = {
                productId: productCode.id,
                remainingStock: getRemainingStokcs(productCode.id),
                undeliveredStock: getUndeliveredStokcs(productCode.id),
            };
            summary = { ...summary, [productCode.id]: prodSummary }
        })
        setProductStockSummary(summary);
    }, [customerStocks]);

    const getRemainingStokcs = (productCode: string) => {
        const total = customerStocks.flatMap(s => s.stocks)
            .filter(s => s.productId === productCode)
            .map(s => s.remainingStock)
            .reduce((a, b) => a + b, 0);

        return +total.toFixed(4);
    }

    const getUndeliveredStokcs = (productCode: string) => {
        var total = customerStocks.flatMap(s => s.stocks)
            .filter(s => s.productId === productCode)
            .map(s => s.undeliveredStock)
            .reduce((a, b) => a + b, 0);
        return +total.toFixed(4);
    }

    const handleCustomerSelect = (customerId: string) => {
        navigate({ pathname: '/entries', search: `?${createSearchParams({ customerId })}` })
    }

    return <Table bordered style={{ tableLayout: 'fixed', textAlign: 'right' }}>
        <thead>
            <tr>
                <th rowSpan={2} className="text-start">
                    Customer
                </th>
                {
                    PRODUCT_CODES.map(code => <th key={code.id} colSpan={2} className="text-center">{code.label}</th>)
                }
            </tr>
            <tr>
                {
                    PRODUCT_CODES.map(code => <Fragment key={code.id}>
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
                        const productStock = customerStock.stocks.find(s => s.productId == productCode.id);
                        return <Fragment key={productCode.id}>
                            <td>
                                {productStock?.remainingStock.toFixed(4)}
                            </td>
                            <td>
                                {productStock?.undeliveredStock.toFixed(4)}
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
                    return <Fragment key={productCode.id}>
                        <th>
                            {productStockSummary[productCode.id]?.remainingStock.toFixed(4)}
                        </th>
                        <th>
                            {productStockSummary[productCode.id]?.undeliveredStock.toFixed(4)}
                        </th>
                    </Fragment>
                })}
            </tr>
            <tr>
                <th className="text-start">
                    Overall Totals
                </th>
                {PRODUCT_CODES.map(productCode => {
                    return <Fragment key={productCode.id}>
                        <th colSpan={2}>
                            {((productStockSummary[productCode.id]?.remainingStock || 0)
                                + (productStockSummary[productCode.id]?.undeliveredStock || 0)).toFixed(4)}
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