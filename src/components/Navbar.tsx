
import { useNavbar } from "@/hooks/useNavbar";
import NavbarLogo from "./navbar/NavbarLogo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import MobileNavigation from "./navbar/MobileNavigation";
import UserActions from "./navbar/UserActions";
import MobileMenuButton from "./navbar/MobileMenuButton";

const Navbar = () => {
  const {
    isOpen,
    setIsOpen,
    scrolled,
    user,
    config,
    handleSignOut,
    handleNavigation,
    navItems
  } = useNavbar();

  return (
    <nav
      className={`${config.navbarSettings.position} top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{
        backgroundColor: scrolled 
          ? `${config.navbarSettings.backgroundColor}f2`
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          <NavbarLogo scrolled={scrolled} />

          <DesktopNavigation 
            navItems={navItems}
            scrolled={scrolled}
            onNavigate={handleNavigation}
          />

          <UserActions
            user={user}
            scrolled={scrolled}
            onNavigate={handleNavigation}
            onSignOut={handleSignOut}
          />

          <MobileMenuButton
            isOpen={isOpen}
            scrolled={scrolled}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        <MobileNavigation
          isOpen={isOpen}
          navItems={navItems}
          onNavigate={handleNavigation}
          user={user}
        />
      </div>
    </nav>
  );
};

export default Navbar;
