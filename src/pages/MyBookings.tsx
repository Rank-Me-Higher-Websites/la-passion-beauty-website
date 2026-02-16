import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, User, Plus, XCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings, cancelBooking } from "@/lib/bookings-store";
import { services, staffMembers, type Booking } from "@/lib/booking-data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user) {
      setBookings(getUserBookings(user.email));
    }
  }, [isAuthenticated, user, navigate]);

  const handleCancel = (id: string) => {
    cancelBooking(id);
    if (user) setBookings(getUserBookings(user.email));
  };

  const getServiceName = (id: string) => services.find((s) => s.id === id)?.name || "Unknown";
  const getStaffName = (id: string) => staffMembers.find((s) => s.id === id)?.name || "Any";

  return (
    <Layout>
      <section className="pt-32 pb-20 min-h-screen bg-background">
        <div className="container-custom max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="heading-section text-foreground">My Bookings</h1>
              <p className="text-body text-sm mt-1">View and manage your appointments</p>
            </div>
            <Button variant="gold" asChild>
              <Link to="/booking">
                <Plus className="h-4 w-4 mr-2" /> Book New
              </Link>
            </Button>
          </div>

          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <CalendarIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="heading-card text-foreground mb-2">No bookings yet</h3>
              <p className="text-body text-sm mb-6">Book your first appointment to get started</p>
              <Button variant="gold" size="lg" asChild>
                <Link to="/booking">Book Now</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {bookings
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-5 shadow-soft"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{getServiceName(booking.serviceId)}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="h-3.5 w-3.5" /> {getStaffName(booking.staffId)}
                        </p>
                      </div>
                      <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full capitalize", statusColors[booking.status])}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {booking.time}
                      </span>
                    </div>

                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="mt-3 flex items-center gap-1 text-sm text-destructive hover:underline"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel Appointment
                      </button>
                    )}
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MyBookings;
