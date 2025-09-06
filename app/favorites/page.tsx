import SidebarMenu from "../../components/sidebar-menu"
import FavoritesContent from "../../components/favorites-content"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SidebarMenu />
      <main className="mr-64 min-h-screen">
        <FavoritesContent />
      </main>
    </div>
  )
}
