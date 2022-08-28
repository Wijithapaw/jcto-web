import { Table } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { EntryTransaction } from "../types";

interface Props {
    items: EntryTransaction[]
}

export default function EntryTransactionsList({ items }: Props) {
    return <> {items.length > 0 ? <Table>
        <thead>
            <tr>
                <th>Order Date</th>
                <th>Order No.</th>
                <th>OB Ref</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Delivered Qty</th>
            </tr>
        </thead>
        <tbody>
            {items.map((val, i) => (<tr key={i}>
                <td>{dateHelpers.toShortDateStr(val.orderDate)}</td>
                <td>{val.orderNo}</td>
                <td>{val.obRef}</td>
                <td className="text-end">{val.quantity.toFixed(4)}</td>
                <td className="text-end">{val.deliveredQuantity.toFixed(4)}</td>
            </tr>))}
        </tbody>
    </Table> : <span className="text-muted"><i>No stock releases</i></span>} </>
}