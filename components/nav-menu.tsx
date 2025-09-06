'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';
import {} from './lib/utils';

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
            <motion.span whileHover={{ color: '#f97316' }}>Anime</motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-orange-500/50 to-pink-500/50 p-6 no-underline outline-none focus:shadow-md"
                    href="/home"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      Spring 2025
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      Explore the latest anime releases from the Spring 2025
                      season
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/anime/seasonal" title="Seasonal Anime">
                Browse anime by season and year
              </ListItem>
              <ListItem href="/anime/top" title="Top Anime">
                Highest rated anime of all time
              </ListItem>
              <ListItem href="/anime/genres" title="Anime Genres">
                Find anime by your favorite genres
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
            <motion.span whileHover={{ color: '#f97316' }}>Manga</motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/manga/new" title="New Releases">
                Latest manga chapters and volumes
              </ListItem>
              <ListItem href="/manga/top" title="Top Manga">
                Highest rated manga of all time
              </ListItem>
              <ListItem href="/manga/genres" title="Manga Genres">
                Find manga by your favorite genres
              </ListItem>
              <ListItem href="/manga/authors" title="Manga Authors">
                Browse manga by your favorite creators
              </ListItem>
              <ListItem href="/manga/publishers" title="Publishers">
                Explore manga from different publishing houses
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
            <motion.span whileHover={{ color: '#f97316' }}>
              Community
            </motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/community/forums" title="Forums">
                Discuss anime and manga with other fans
              </ListItem>
              <ListItem href="/community/reviews" title="Reviews">
                Read and write reviews for your favorite titles
              </ListItem>
              <ListItem href="/community/news" title="News">
                Stay updated with the latest anime and manga news
              </ListItem>
              <ListItem href="/community/events" title="Events">
                Find anime conventions and community events
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/news" legacyBehavior passHref>
            <NavigationMenuLink
              className={
                navigationMenuTriggerStyle() +
                ' bg-transparent hover:bg-white/10'
              }
            >
              <motion.span whileHover={{ color: '#f97316' }}>News</motion.span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={
            ('block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-orange-400',
            className)
          }
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
