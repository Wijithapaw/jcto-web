import { Fragment, useEffect, useState } from "react";
import { Table } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { IDictionary } from "../../../app/types";
import { customerStocksSelector, getCustomerStocksAsync, productsListItemsSelector } from "../customer-slice"
import { ProductStock } from "../types";
import { createSearchParams, useNavigate } from 'react-router-dom'
import { numbersHelpers } from "../../../app/helpers";

export default function CustomerStocks() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const products = useAppSelector(productsListItemsSelector);
    const customerStocks = useAppSelector(customerStocksSelector);

    const [productStockSummary, setProductStockSummary] = useState<IDictionary<ProductStock>>({});

    useEffect(() => {
        dispatch(getCustomerStocksAsync());
    }, [])

    useEffect(() => {
        let summary = {};
        products.forEach(productCode => {
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

        return total;
    }

    const getUndeliveredStokcs = (productCode: string) => {
        var total = customerStocks.flatMap(s => s.stocks)
            .filter(s => s.productId === productCode)
            .map(s => s.undeliveredStock)
            .reduce((a, b) => a + b, 0);
        return total;
    }

    const handleCustomerSelect = (customerId: string) => {
        navigate({ pathname: '/discharges', search: `?${createSearchParams({ customerId })}` })
    }

    return <Table bordered style={{ textAlign: 'right' }} responsive>
        <thead>
            <tr>
                <th rowSpan={2} className="text-start">
                    Customer
                </th>
                {
                    products.map(code => <th key={code.id} colSpan={2} className="text-center">{code.label}</th>)
                }
            </tr>
            <tr>
                {
                    products.map(code => <Fragment key={code.id}>
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
                    {products.map(productCode => {
                        const productStock = customerStock.stocks.find(s => s.productId == productCode.id);
                        return <Fragment key={productCode.id}>
                            <td>
                                {numbersHelpers.toDisplayStr(productStock?.remainingStock || 0)}
                            </td>
                            <td>
                                {numbersHelpers.toDisplayStr(productStock?.undeliveredStock || 0)}
                            </td>
                        </Fragment>
                    })}
                </tr>)
            }
            <tr>
                <th className="text-start">
                    Totals
                </th>
                {products.map(productCode => {
                    return <Fragment key={productCode.id}>
                        <th>
                            {numbersHelpers.toDisplayStr(productStockSummary[productCode.id]?.remainingStock || 0)}
                        </th>
                        <th>
                            {numbersHelpers.toDisplayStr(productStockSummary[productCode.id]?.undeliveredStock || 0)}
                        </th>
                    </Fragment>
                })}
            </tr>
            <tr>
                <th className="text-start">
                    Overall Totals
                </th>
                {products.map(productCode => {
                    return <Fragment key={productCode.id}>
                        <th colSpan={2} className="text-center">
                            {numbersHelpers.toDisplayStr((productStockSummary[productCode.id]?.remainingStock || 0)
                                + (productStockSummary[productCode.id]?.undeliveredStock || 0))}
                        </th>
                    </Fragment>
                })}
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={products.length * 2 + 1} className="text-start text-muted">
                    <i><small>*All the figures are in metric tons (MT)</small></i>
                </td>
            </tr>
        </tfoot>
    </Table>
}