
"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, UserPlus, UserCircle, LogOut, Settings, LayoutDashboard } from "lucide-react"

// Placeholder for authentication state.
// In a real application, this would be managed by an authentication system.
const isAuthenticated = false; 
const userName = "Advocate User"; // Placeholder user name
const userEmail = "user@hakichain.com"; // Placeholder user email

export function UserNav() {
  // If isAuthenticated is true (user is logged in), show user avatar and menu.
  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/100x100.png" alt={userName} data-ai-hint="profile avatar" />
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile"> {/* Assuming a profile page */}
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard"> {/* Generic dashboard link */}
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"> {/* Assuming a settings page */}
                 <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            {/* Add logout functionality here */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Otherwise (user is not logged in), show Login and Sign Up buttons.
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        asChild
        className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Link href="/auth/login">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Link>
      </Button>
      <Button 
        variant="outline" 
        size="lg" 
        asChild
        className="text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground"
      >
        <Link href="/auth/signup">
          <UserPlus className="mr-2 h-4 w-4" /> Sign Up
        </Link>
      </Button>
    </div>
  )
}
