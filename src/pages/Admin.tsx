import { useState, useMemo } from "react";
import { format, isSameDay, parseISO, startOfWeek, addDays, setMonth, setYear } from "date-fns";
import {
  CalendarIcon,
  List,
  Users,
  Clock,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  LayoutDashboard,
  Menu as MenuIcon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  services,
  staffMembers,
  mockBookings,
  type Booking,
} from "@/lib/booking-data";
import logo from "@/assets/logo.png";

type Tab = "dashboard" | "bookings" | "calendar" | "staff";

const statusColors: Record<Booking["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all");

  const getServiceName = (id: string) => services.find((s) => s.id === id)?.name || id;
  const getStaffName = (id: string) => staffMembers.find((s) => s.id === id)?.name || id;

  const staffFilteredBookings = useMemo(() => {
    if (selectedStaffId === "all") return bookings;
    return bookings.filter((b) => b.staffId === selectedStaffId);
  }, [bookings, selectedStaffId]);

  const todayBookings = useMemo(
    () => staffFilteredBookings.filter((b) => isSameDay(parseISO(b.date), new Date())),
    [staffFilteredBookings]
  );

  const filteredBookings = useMemo(() => {
    let filtered = staffFilteredBookings;
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [staffFilteredBookings, statusFilter]);

  const updateStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "bookings", label: "Bookings", icon: List },
    { key: "calendar", label: "Calendar", icon: CalendarIcon },
    { key: "staff", label: "Staff", icon: Users },
  ];

  const StaffFilter = () => (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => setSelectedStaffId("all")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
          selectedStaffId === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent"
        )}
      >
        All
      </button>
      {staffMembers.map((staff) => (
        <button
          key={staff.id}
          onClick={() => setSelectedStaffId(staff.id)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedStaffId === staff.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          {staff.name}
        </button>
      ))}
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <img src={logo} alt="La Passion" className="h-14 w-auto" />
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" asChild>
          <a href="/"><LogOut className="h-4 w-4 mr-2" /> Back to Site</a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 border-r border-border bg-card fixed h-full">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-card h-full shadow-elevated">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground capitalize">
                {activeTab}
              </h1>
              {selectedStaffId !== "all" && (
                <p className="text-xs text-primary font-medium">
                  Viewing: {staffMembers.find(s => s.id === selectedStaffId)?.name}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMM d")}</p>
        </header>

        <div className="p-4 md:p-6 max-w-5xl">
          <StaffFilter />
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Today", value: todayBookings.length, color: "text-primary" },
                  { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "text-yellow-600" },
                  { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, color: "text-green-600" },
                  { label: "Total", value: bookings.length, color: "text-foreground" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-2xl font-semibold mt-1", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Today's bookings */}
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Today's Appointments</h2>
                {todayBookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm bg-card rounded-xl border border-border p-6 text-center">
                    No appointments today
                  </p>
                ) : (
                  <div className="space-y-2">
                    {todayBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        getServiceName={getServiceName}
                        getStaffName={getStaffName}
                        onUpdateStatus={updateStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings List */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    getServiceName={getServiceName}
                    getStaffName={getStaffName}
                    onUpdateStatus={updateStatus}
                    showDate
                  />
                ))}
              </div>
            </div>
          )}

          {/* Calendar View */}
          {activeTab === "calendar" && (
            <div className="space-y-4">
              {/* Month/Year selector above calendar */}
              <div className="flex items-center gap-4">
                <select
                  value={selectedDate.getMonth()}
                  onChange={(e) => setSelectedDate(setMonth(selectedDate, parseInt(e.target.value)))}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{format(new Date(2024, i), "MMMM")}</option>
                  ))}
                </select>
                <select
                  value={selectedDate.getFullYear()}
                  onChange={(e) => setSelectedDate(setYear(selectedDate, parseInt(e.target.value)))}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: 5 }, (_, i) => 2024 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  month={selectedDate}
                  onMonthChange={setSelectedDate}
                  className="p-0 pointer-events-auto w-full"
                  classNames={{
                    months: "flex flex-col w-full",
                    month: "space-y-6 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-lg font-semibold",
                    nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md inline-flex items-center justify-center",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md flex-1 font-medium text-sm py-2",
                    row: "flex w-full mt-1",
                    cell: "flex-1 text-center text-sm p-1 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md inline-flex items-center justify-center transition-colors",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-3">
                  {format(selectedDate, "EEEE, MMMM d")}
                </h3>
                {staffFilteredBookings
                  .filter((b) => isSameDay(parseISO(b.date), selectedDate))
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      getServiceName={getServiceName}
                      getStaffName={getStaffName}
                      onUpdateStatus={updateStatus}
                    />
                  ))}
                {!staffFilteredBookings.some((b) => isSameDay(parseISO(b.date), selectedDate)) && (
                  <p className="text-muted-foreground text-sm text-center py-8">No bookings on this day</p>
                )}
              </div>
            </div>
          )}

          {/* Staff */}
          {activeTab === "staff" && (
            <div className="space-y-4">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">{staff.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {staff.services.map((s) => (
                      <span key={s} className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground capitalize">
                        {s.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      Upcoming: {bookings.filter((b) => b.staffId === staff.id && (b.status === "pending" || b.status === "confirmed")).length} bookings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Booking card component
function BookingCard({
  booking,
  getServiceName,
  getStaffName,
  onUpdateStatus,
  showDate,
}: {
  booking: Booking;
  getServiceName: (id: string) => string;
  getStaffName: (id: string) => string;
  onUpdateStatus: (id: string, status: Booking["status"]) => void;
  showDate?: boolean;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-2">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-foreground">{booking.clientName}</p>
          <p className="text-sm text-primary font-medium">{getServiceName(booking.serviceId)}</p>
        </div>
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", statusColors[booking.status])}>
          {booking.status}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {booking.time}
        </span>
        {showDate && (
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" /> {format(parseISO(booking.date), "MMM d")}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {getStaffName(booking.staffId)}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
        <a href={`tel:${booking.clientPhone}`} className="flex items-center gap-1 hover:text-primary">
          <Phone className="h-3 w-3" /> {booking.clientPhone}
        </a>
        <a href={`mailto:${booking.clientEmail}`} className="flex items-center gap-1 hover:text-primary">
          <Mail className="h-3 w-3" /> {booking.clientEmail}
        </a>
      </div>
      {(booking.status === "pending" || booking.status === "confirmed") && (
        <div className="flex gap-2">
          {booking.status === "pending" && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => onUpdateStatus(booking.id, "confirmed")}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Confirm
            </Button>
          )}
          {booking.status === "confirmed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(booking.id, "completed")}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Complete
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(booking.id, "cancelled")}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export default Admin;
