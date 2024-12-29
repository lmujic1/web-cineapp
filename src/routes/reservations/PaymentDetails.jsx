import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import format from "date-fns/format";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import Image from "../../components/Image";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import CreditCard from "../../components/CreditCard";
import PaymentForm from "./PaymentForm";

import { reservation } from "../../utils/api";

const savedCards = [
    { cardNumber: "1234 5678 9101 1121", expiryDate: "12/24", cvv: "123", type: "visa" },
    { cardNumber: "3141 5161 7181 9202", expiryDate: "05/25", cvv: "456", type: "mastercard" }
];

const PaymentDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reservationId, movie, cover, projection, date, totalPrice, selectedSeats } = location.state;

    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [modal, setModal] = useState(false);

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem("token");
            let response;

            if (!reservationId) {
                response = await axios.post(
                    `${reservation}`,
                    {
                        date,
                        projectionId: projection.projectionId,
                        seats: selectedSeats,
                        price: totalPrice,
                        type: "BUY"
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
            } else {
                response = await axios.put(
                    `${reservation}/${reservationId}/buy-ticket`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
            }

            if (response.status === 200) {
                setModal(true);
            }
        } catch (error) {
            console.error("Payment error:", error.response?.data?.message || error.message);
        }
    };

    const downloadDetailedPDF = async () => {
        try {
            const element = document.getElementById('booking-summary');
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            const desiredWidth = 100;
            const desiredHeight = canvas.height * (desiredWidth / canvas.width);
            const detailedPdf = new jsPDF();
            detailedPdf.addImage(imgData, 'PNG', 10, 10, desiredWidth, desiredHeight);
            detailedPdf.save('tickets.pdf');
        } catch (error) {
            console.error('Error generating detailed PDF:', error);
        }
    };

    const downloadReceiptPDF = () => {
        const receiptPdf = new jsPDF();
        const marginLeft = 20;
        receiptPdf.setFontSize(16);
        receiptPdf.text("Receipt", marginLeft, 20);
        receiptPdf.setFontSize(12);
        receiptPdf.text(`Movie: ${movie.name}`, marginLeft, 30);
        receiptPdf.text(`Date: ${format(date, "EEEE, MMM dd")}`, marginLeft, 40);
        receiptPdf.text(`Time: ${projection.time.slice(0, 5)}`, marginLeft, 50);
        receiptPdf.text("Purchased Tickets:", marginLeft, 60);
        selectedSeats.forEach((seat, index) => {
            receiptPdf.text(`Seat: ${seat}`, marginLeft + 10, 70 + (index * 10));
        });
        receiptPdf.line(marginLeft, 80 + (selectedSeats.length * 10), 190, 80 + (selectedSeats.length * 10));
        receiptPdf.text(`Total Price: ${totalPrice} KM`, 190 - marginLeft, 90 + (selectedSeats.length * 10), { align: 'right' });
        receiptPdf.save('receipt.pdf');
    };

    const downloadBothPDFs = async () => {
        await downloadDetailedPDF();
        downloadReceiptPDF();

        const timeoutId = setTimeout(() => {
            navigate("/");
        }, 4000);

        return () => clearTimeout(timeoutId);
    };

    return (
        <div className="font-body">
            <div className="border-b border-primary-600">
                <p className="text-neutral-800 text-heading-h5 py-16 px-[118px]">Payment Details</p>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 px-[118px] pt-24 pb-64">
                <div className="col-span-2 pr-24">
                    <p className="text-heading-h6 text-neutral-500">Saved Cards</p>
                    { savedCards.map((card, i) => (
                        <CreditCard
                            key={ i }
                            className={ `my-24 ${selectedCardIndex === i ? "border border-primary-600" : "border border-neutral-200"}` }
                            cardNumber={ card.cardNumber }
                            type={ card.type }
                            onClick={ () => setSelectedCardIndex(selectedCardIndex === i ? null : i) }
                        />
                    )) }
                    <div className="flex gap-16 items-center justify-center pt-8">
                        <div className="w-[45%] border border-neutral-200 h-[1px]"></div>
                        <p className="text-heading-h6 text-neutral-500">or</p>
                        <div className="w-[45%] border border-neutral-200 h-[1px]"></div>
                    </div>
                    <div className="pt-16 pb-[85px]">
                        <p className="text-neutral-500 text-heading-h6 pb-24">Add New Card</p>
                        <PaymentForm totalPrice={ totalPrice } handlePayment={ handlePayment } />
                    </div>
                </div>

                <div className="text-neutral-25">
                    <p className="text-heading-h6 text-neutral-500 pb-24">Booking Summary</p>
                    <div id="booking-summary" className="rounded-16 bg-neutral-800 flex flex-col items-center justify-center">
                        <div className="px-12 py-24 w-[90%] flex border-b border-neutral-200">
                            <Image className="rounded-12 object-cover h-[126px] w-[125px]" src={ cover } alt="" />
                            <div className="pl-16">
                                <p className="text-heading-h6 pb-6">{ movie.name }</p>
                                <div className="flex text-body-l font-normal pt-[10px] pb-[6px]">
                                    <p className="border-primary-600 h-[20px] pr-12 border-r">{ movie.rating }</p>
                                    <p className="border-primary-600 h-[20px] px-12 border-r">{ movie.language }</p>
                                    <p className="pl-12">{ movie.duration } Min</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col text-body-l px-24 pt-32 pb-[85px] w-full">
                            <p className="text-neutral-400 pb-4">Date and Time</p>
                            <p className="font-semibold pb-16">{ format(date, "EEEE, MMM dd") } at { projection.time.slice(0, 5) }</p>
                            <p className="text-neutral-400 pb-4">Cinema Details</p>
                            <p className="font-semibold">{ projection.venue.street } { projection.venue.streetNumber },<br />{ projection.venue.city.name }</p>
                            <p className="font-semibold pb-16 pt-4">Hall 1</p>
                            <p className="text-neutral-400 pb-4">Seat(s) Details</p>
                            <p>Seat(s): <span className="font-semibold">{ selectedSeats.join(', ') }</span></p>
                            <p className="text-neutral-400 pt-16 pb-8">Price Details</p>
                            <p>Total Price: <span className="font-semibold">{ totalPrice } KM</span></p>
                        </div>
                    </div>
                </div>
            </div>
            { modal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Payment Successful!</p>
                    <p className="text-body-m text-neutral-500 text-justify">
                        The receipt and ticket have been sent to your email. You may download them immediately, or retrieve them later from your User Profile.
                    </p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button variant="secondary" size="sm" onClick={ () => navigate("/") }>Back to Home</Button>
                        <Button size="sm" onClick={ downloadBothPDFs }>Download</Button>
                    </div>
                </Modal>
            ) }
        </div>
    );
};

export default PaymentDetails;
