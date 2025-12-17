<header className="w-full bg-white shadow-md sticky top-0 z-50 relative">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <Link href="/" className="text-3xl font-extrabold text-blue-700 hover:text-blue-800 transition duration-200">
      PrimeCare
    </Link>

    <nav className="hidden md:flex gap-8 text-lg items-center">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
          {link.label}
        </Link>
      ))}
      <Link href="/appointment" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md">
        Ballan Qabso
      </Link>
    </nav>

    <button 
      className="md:hidden text-gray-700"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
    </button>
  </div>

  {isMenuOpen && (
    <div className="md:hidden bg-gray-50 border-t border-gray-200 py-4 px-4 shadow-inner z-40 relative">
      <nav className="flex flex-col gap-4 text-base">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`py-2 px-3 rounded-lg ${linkStyle(link.href)} ${pathname === link.href ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/appointment" className="mt-2 text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition duration-300">
          Ballan Qabso Degdeg
        </Link>
      </nav>
    </div>
  )}
</header>
