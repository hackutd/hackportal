import React from 'react';

/**
 * Sidebar for the hackerpack; this is hidden on mobile
 */
export default function HackerpackSidebar({ content }: { content: SidebarSection[] }) {
  return (
    <>
      {/* ghost section to fill in for fixed sidebar */}
      <section
        id="ghost"
        className="hidden md:flex justify-center h-screen sticky top-0 md:w-1/6 2xl:w-1/8 text-xs md:text-xs lg:text-sm overflow-auto"
      ></section>

      <section
        id="Sidebar"
        className="hidden md:flex justify-center h-screen fixed top-16 border-r-2 border-gray-600 w-1/4 md:w-1/6 2xl:w-1/8 text-xs md:text-xs lg:text-sm overflow-auto"
      >
        <section id="options" className="relative px-6 py-4">
          <div className="font-bold mb-3 mt-4">HackerPack</div>
          <ul className="">
            {/* Maps the sidebar-content.json file to a nested list */}
            {content.map((mainSection) => (
              <li key={mainSection.title}>
                {mainSection.title}
                {mainSection.sections ? (
                  <ul className="pl-4">
                    {mainSection.sections.map((subsection) => (
                      <li key={subsection.title}>
                        <a href={subsection.href || '#'}>{subsection.title}</a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </>
  );
}
