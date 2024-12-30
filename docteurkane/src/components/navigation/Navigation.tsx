'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiCalendar, FiUsers, FiSettings, FiFolder } from 'react-icons/fi';

const links = [
  { name: 'Accueil', href: '/', icon: FiHome },
  { name: 'Agenda', href: '/agenda', icon: FiCalendar },
  { name: 'Patients', href: '/patients', icon: FiUsers },
  { name: 'Dossier Médical', href: '/dossiers-medicaux', icon: FiFolder },
  { name: 'Paramètres', href: '/settings', icon: FiSettings },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg"
            >
              <FiHome className="w-6 h-6" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DrKane
            </span>
          </Link>

          {/* Navigation principale - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                      transition-colors duration-200
                      ${isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Navigation mobile */}
          <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/80 px-4 py-2">
            <div className="flex justify-around items-center">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      className={`
                        flex flex-col items-center gap-1 p-2 rounded-xl
                        ${isActive 
                          ? 'text-blue-600' 
                          : 'text-gray-600'
                        }
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{link.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileTab"
                          className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
