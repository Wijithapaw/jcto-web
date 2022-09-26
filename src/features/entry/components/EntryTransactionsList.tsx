import { Table } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import AppIcon from "../../../components/AppIcon";
import { OrderStatus } from "../../order/types";
import { EntryTransaction, EntryTransactionType, getApprovalType } from "../types";
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useMemo } from "react";

interface Props {
    items: EntryTransaction[]
}

export default function EntryTransactionsList({ items }: Props) {
    const itemsFormated = useMemo(() => {
        const formated: EntryTransaction[] = [];
        items.filter(i => i.type == EntryTransactionType.Approval).forEach(approval => {
            const outgoing = items.filter(i => i.approvalId == approval.id);
            const totalOut = outgoing
                .map(e => e.orderStatus == OrderStatus.Delivered ? e.deliveredQuantity : e.quantity)
                .reduce((a,b) => a + b, 0);
            const balanceQty = approval.quantity + totalOut;

            formated.push({...approval, balance: balanceQty });
            formated.push(...outgoing);
        });
        return formated;
    }, [items])

    const navigate = useNavigate();

    return <> {itemsFormated.length > 0 ? <Table responsive>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Approval</th>
                <th>OB Ref</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Delivered Qty</th>
            </tr>
        </thead>
        <tbody>
            {itemsFormated.map((val, i) => (<tr key={i} className={val.type === EntryTransactionType.Approval ? `text-success` : ''}>
                <td>{dateHelpers.toShortDateStr(val.transactionDate)}</td>
                <td>
                    {val.type === EntryTransactionType.Approval ? `Approval (Bal: ${val.balance})`
                        : <> {`Order-${val.orderNo}`} <AppIcon size="xs"
                            className={`me-2 ${val.orderStatus === OrderStatus.Delivered ? 'text-success' : 'text-danger'}`}
                            icon={val.orderStatus === OrderStatus.Delivered ? 'check' : 'x'}
                        /></>
                    }
                </td>
                <td>
                    {`${getApprovalType(val.approvalType)} ${val.approvalRef ? `-${val.approvalRef}` : ''}`}
                    {
                        val.type === EntryTransactionType.Approval && <AppIcon
                            className="ms-2 text-primary"
                            icon="arrow-alt-circle-right"
                            title="Create order"
                            mode="button"
                            onClick={() => {
                                navigate({ pathname: '/orders', search: `?${createSearchParams({ approvalId: val.id || 'test' })}` })
                            }}
                        />
                    }
                </td>
                <td>{val.obRef}</td>
                <td className="text-end">{Math.abs(val.quantity).toFixed(3)}</td>
                <td className="text-end">
                    {val.deliveredQuantity && Math.abs(val.deliveredQuantity).toFixed(3)}
                </td>
            </tr>))}
        </tbody>
    </Table> : <span className="text-muted"><i>No stock releases</i></span>} </>
}