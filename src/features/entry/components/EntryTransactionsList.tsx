import { Table } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import AppIcon from "../../../components/AppIcon";
import { OrderStatus } from "../../order/types";
import { EntryTransaction, EntryTransactionType, getApprovalType } from "../types";

interface Props {
    items: EntryTransaction[]
}

export default function EntryTransactionsList({ items }: Props) {
    return <> {items.length > 0 ? <Table responsive>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Approval</th>
                <th>Order No.</th>
                <th>OB Ref</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Delivered Qty</th>
            </tr>
        </thead>
        <tbody>
            {items.map((val, i) => (<tr key={i} className={val.type === EntryTransactionType.Approval ? `text-success` : ''}>
                <td>{dateHelpers.toShortDateStr(val.transactionDate)}</td>
                <td>{val.type === EntryTransactionType.Approval ? 'Approval' : 'Order'} </td>
                <td>{`${getApprovalType(val.approvalType)} ${val.approvalRef ? `(${val.approvalRef})` : ''}`}</td>
                <td>
                    {val.orderNo && <AppIcon size="xs"
                        className={`me-2 ${val.orderStatus === OrderStatus.Delivered ? 'text-success' : 'text-danger'}`}
                        icon={val.orderStatus === OrderStatus.Delivered ? 'check' : 'x'}
                    /> || val.orderStatus}
                    {val.orderNo}
                </td>
                <td>{val.obRef}</td>
                <td className="text-end">{Math.abs(val.quantity).toFixed(4)}</td>
                <td className="text-end">
                    {val.deliveredQuantity && Math.abs(val.deliveredQuantity).toFixed(4)}
                </td>
            </tr>))}
        </tbody>
    </Table> : <span className="text-muted"><i>No stock releases</i></span>} </>
}