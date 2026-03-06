import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1">
                {/* Hero */}
                <div className="bg-gradient-to-br from-primary/10 via-background to-background py-16 border-b border-border">
                    <div className="container-width text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-display font-bold mb-4"
                        >
                            Visit Our Showroom
                        </motion.h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Come experience our premium motorcycle collection in person. Our expert team is ready to help you find your perfect ride.
                        </p>
                    </div>
                </div>

                <div className="container-width py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-6">
                                <h2 className="text-2xl font-bold font-display">Rakesh Premium Bikes</h2>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Showroom Address</p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            123, Main Road, Hyderabad,<br />
                                            Telangana – 500001, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Phone</p>
                                        <a href="tel:+919390389606" className="text-primary hover:underline text-lg font-medium">
                                            +91 93903 89606
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Email</p>
                                        <a href="mailto:rrakesh20235@gmail.com" className="text-primary hover:underline">
                                            rrakesh20235@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="w-full">
                                        <p className="font-semibold mb-3">Showroom Hours</p>
                                        <div className="space-y-2 text-sm">
                                            {[
                                                { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM", open: true },
                                                { day: "Saturday", hours: "9:00 AM – 6:00 PM", open: true },
                                                { day: "Sunday", hours: "10:00 AM – 5:00 PM", open: true },
                                            ].map(({ day, hours, open }) => (
                                                <div key={day} className="flex justify-between items-center py-1.5 border-b border-dashed border-border last:border-0">
                                                    <span className="text-muted-foreground">{day}</span>
                                                    <span className={`font-medium ${open ? "text-foreground" : "text-red-500"}`}>{hours}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-border space-y-3">
                                    <Button
                                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white gap-2 text-base"
                                        onClick={() =>
                                            window.open(
                                                "https://wa.me/919390389606?text=Hello%20Rakesh%2C%20I%20would%20like%20to%20visit%20your%20showroom.%20Please%20share%20details.",
                                                "_blank"
                                            )
                                        }
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Chat on WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 gap-2"
                                        asChild
                                    >
                                        <a href="tel:+919390389606">
                                            <Phone className="h-5 w-5" />
                                            Call Now
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Google Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-2xl overflow-hidden border border-border shadow-sm"
                        >
                            <div className="bg-gradient-to-br from-primary/5 to-muted h-[420px] flex flex-col items-center justify-center text-center p-10 gap-5">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <MapPin className="h-10 w-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Find Us On Google Maps</h3>
                                    <p className="text-muted-foreground text-base max-w-xs mx-auto mb-6">
                                        Click the button below to get turn-by-turn directions to our showroom.
                                    </p>
                                    <Button
                                        size="lg"
                                        className="gap-2"
                                        asChild
                                    >
                                        <a
                                            href="https://maps.app.goo.gl/AtvbaGEYUprJWSzZ8"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MapPin className="h-5 w-5" />
                                            Open in Google Maps
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Info Bar */}
                            <div className="bg-card border-t border-border grid grid-cols-3 divide-x divide-border text-center py-4">
                                <div className="py-2 px-4">
                                    <p className="text-xs text-muted-foreground">Response Time</p>
                                    <p className="font-semibold text-sm">Under 1 hour</p>
                                </div>
                                <div className="py-2 px-4">
                                    <p className="text-xs text-muted-foreground">Test Rides</p>
                                    <p className="font-semibold text-sm">Available</p>
                                </div>
                                <div className="py-2 px-4">
                                    <p className="text-xs text-muted-foreground">Finance</p>
                                    <p className="font-semibold text-sm">Easy EMI</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
