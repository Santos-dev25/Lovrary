import { useBooks } from "@/context/BooksContext";
import { BookOpen, Star, Bookmark, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const RecentActivity = () => {
  const { books } = useBooks();

  // Generate activities dynamically from book data
  const activities: { icon: typeof CheckCircle; text: string; time: string; color: string }[] = [];

  books.forEach(book => {
    if (book.status === "lido" && book.dateFinished) {
      activities.push({
        icon: CheckCircle,
        text: `Você finalizou "${book.title}"`,
        time: book.dateFinished,
        color: "text-marsala",
      });
    }
    if (book.notes && book.notes.length > 0) {
      const lastNote = book.notes[book.notes.length - 1];
      activities.push({
        icon: Bookmark,
        text: `Nova anotação em "${book.title}" — ${lastNote.chapter || "Journal"}`,
        time: `${lastNote.date} às ${lastNote.time}`,
        color: "text-gold",
      });
    }
    if (book.rating > 0 && book.status === "lido") {
      activities.push({
        icon: Star,
        text: `Você avaliou "${book.title}" com ${book.rating} estrelas`,
        time: book.dateFinished || "Avaliação",
        color: "text-gold",
      });
    }
    if (book.status === "lendo") {
      activities.push({
        icon: BookOpen,
        text: `Lendo "${book.title}" — ${book.progress || 0}%`,
        time: "Em andamento",
        color: "text-marsala",
      });
    }
  });

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-lg text-foreground">Atividade Recente</h3>
      {recentActivities.length === 0 ? (
        <div className="bg-card/60 rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground">Nenhuma atividade registrada ainda.</p>
          <p className="text-[11px] text-muted-foreground/80 mt-1">
            Conforme você ler, avaliar e fizer anotações nos livros, elas aparecerão aqui!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentActivities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 bg-card rounded-xl border border-border p-3.5 shadow-card"
              >
                <div className="p-1.5 rounded-lg bg-secondary shrink-0 mt-0.5">
                  <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p translate="no" className="notranslate text-xs font-medium text-foreground leading-snug">
                    {activity.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
