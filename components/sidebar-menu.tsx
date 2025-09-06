'use client';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import {
  Home,
  Heart,
  Search,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  Menu,
  X,
  Play,
  Star,
  Clock,
} from 'lucide-react';

interface SidebarMenuProps {
  className?: string;
}

export default function SidebarMenu({ className }: SidebarMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'الرئيسية', href: '/', active: true },
    { icon: Search, label: 'البحث', href: '/search' },
    { icon: Heart, label: 'المفضلة', href: '/favorites' },
    { icon: Clock, label: 'المشاهدة لاحقاً', href: '/watchlist' },
    { icon: Star, label: 'التقييمات', href: '/ratings' },
  ];

  const accountItems = [
    { icon: User, label: 'الملف الشخصي', href: '/profile' },
    { icon: CreditCard, label: 'الاشتراك', href: '/subscription' },
    { icon: MessageSquare, label: 'التعليقات', href: '/feedback' },
    { icon: Settings, label: 'الإعدادات', href: '/settings' },
  ];

  return (
    <div
      className={cn(
        'fixed right-0 top-0 z-50 h-screen transition-all duration-300 glass-dark',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              أنمي ستريم
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-full p-4 gap-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              التصفح
            </h3>
          )}
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={item.active ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-10',
                item.active
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          ))}
        </div>

        {/* Account Section */}
        <div className="space-y-2 mt-auto">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              الحساب
            </h3>
          )}
          {accountItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          ))}
        </div>

        {/* User Profile */}
        <div
          className={cn(
            'border-t border-sidebar-border pt-4 mt-4',
            isCollapsed && 'px-1'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-foreground">
                أح
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  أحمد محمد
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  مشترك مميز
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
