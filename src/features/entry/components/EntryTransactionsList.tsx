import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { dateHelpers, numbersHelpers } from "../../../app/helpers";
import AppIcon from "../../../components/AppIcon";
import { OrderStatus } from "../../order/types";
import { EntryListItem, EntryTransaction, EntryTransactionType, getApprovalType } from "../types";
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from "react";
import { entryApi } from "../entry-api";
import { NotificationType, showNotification } from "../../../app/notification-service";
import EntryApprovalForm from "./EntryApprovalForm";
import OrderStatusIcon from "../../order/components/OrderStatusIcon";
import OrderDetailsForm from "../../order/components/OrderDetailsForm";

interface Props {
    entry: EntryListItem,
    items: EntryTransaction[];
    onUpdate?: () => void;
}

export default function EntryTransactionsList({ entry, items, onUpdate }: Props) {
    const [edidingApprovalId, setEditingApprovalId] = useState<string>();
    const [selectedOrderId, setSelectedOrderId] = useState<string>();

    const itemsFormated = useMemo(() => {
        const formated: EntryTransaction[] = [];
        items.filter(i => i.type != EntryTransactionType.Out).forEach(approval => {
            if (approval.type == EntryTransactionType.Approval) {
                const outgoing = items.filter(i => i.approvalId == approval.id);
                const totalOut = numbersHelpers.sanitize(outgoing
                    .filter(i => i.orderStatus != OrderStatus.Cancelled)
                    .map(e => e.orderStatus == OrderStatus.Delivered ? e.deliveredQuantity : e.quantity)
                    .reduce((a, b) => a + b, 0));
                let balanceQty = approval.quantity + totalOut;

                if (balanceQty > entry.remainingQuantity)
                    balanceQty = entry.remainingQuantity;

                formated.push({ ...approval, balance: balanceQty, canDelete: (outgoing.length == 0) });
                formated.push(...outgoing);
            } else {
                formated.push(approval);
            }
        });
        return formated;
    }, [items])


    const handleDeleteApproval = (id: string) => {
        if (window.confirm("Are you sure you want to delete the approval?")) {
            entryApi.deleteApproval(id).then(() => {
                showNotification(NotificationType.success, "Approval deleted");
                onUpdate && onUpdate();
            });
        }
    }

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
            {itemsFormated.map((val, i) => (<tr key={i}
                className={val.type === EntryTransactionType.RebondTo ? 'text-warning'
                    : val.type === EntryTransactionType.Approval ? `text-success`
                        : val.orderStatus === OrderStatus.Cancelled ? 'text-muted'
                            : ''}>
                <td>{dateHelpers.toShortDateStr(val.transactionDate)}</td>
                <td>
                    {val.type === EntryTransactionType.RebondTo ? `Rebonded To -> ${val.rebondedTo || ''}`
                        : val.type === EntryTransactionType.Approval ? `Approval (Bal: ${numbersHelpers.toDisplayStr(val.balance || 0)})`
                            : <>
                                <span className="txt-link" onClick={() => setSelectedOrderId(val.orderId)}>
                                    {`Order-${val.orderNo}`}
                                </span>
                                <OrderStatusIcon status={val.orderStatus!} />
                            </>
                    }
                    {val.type === EntryTransactionType.Approval && <AppIcon icon="pencil"
                        title="Edit approval"
                        className="ms-2"
                        color="black"
                        onClick={() => setEditingApprovalId(val.id!)}
                        mode="button" />}
                    {val.type === EntryTransactionType.Approval && val.canDelete && <AppIcon icon="trash"
                        title="Delete approval"
                        className="ms-2 text-danger"
                        onClick={() => handleDeleteApproval(val.id!)}
                        mode="button" />}
                </td>
                <td>
                    {`${getApprovalType(val.approvalType)}${val.approvalRef ? ` - ${val.approvalRef}` : ''}`}
                    {
                        (val.type === EntryTransactionType.Approval && val.balance && val.balance > 0) ? <AppIcon
                            className="ms-2 text-primary"
                            icon="arrow-alt-circle-right"
                            title="Create order"
                            mode="button"
                            onClick={() => {
                                navigate({ pathname: '/orders', search: `?${createSearchParams({ approvalId: val.id || 'test' })}` })
                            }}
                        /> : null
                    }
                </td>
                <td>{val.obRef}</td>
                <td className="text-end">{numbersHelpers.toDisplayStr(Math.abs(val.quantity))}</td>
                <td className="text-end">
                    {val.deliveredQuantity && numbersHelpers.toDisplayStr(Math.abs(val.deliveredQuantity))}
                </td>
            </tr>))}
        </tbody>
    </Table> : <span className="text-muted"><i>No stock releases</i></span>}
        <Modal isOpen={!!edidingApprovalId} size="md" toggle={() => setEditingApprovalId(undefined)} backdrop="static">
            <ModalHeader toggle={() => setEditingApprovalId(undefined)}>
                Edit Approval
            </ModalHeader>
            <ModalBody>
                <EntryApprovalForm entryId="" id={edidingApprovalId} onUpdate={onUpdate} />
            </ModalBody>
        </Modal>
        <Modal isOpen={!!selectedOrderId} size="xl" toggle={() => setSelectedOrderId(undefined)} backdrop="static">
            <ModalHeader toggle={() => setSelectedOrderId(undefined)}>
                Order Details
            </ModalHeader>
            <ModalBody>
                <OrderDetailsForm orderId={selectedOrderId} onUpdate={onUpdate}
                    onDelete={() => {
                        onUpdate && onUpdate();
                        setSelectedOrderId(undefined);
                    }} />
            </ModalBody>
        </Modal>
    </>
}