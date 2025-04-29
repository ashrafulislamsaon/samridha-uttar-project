"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit2, Save, X } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<string>("")
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (user: User) => {
    setEditingUserId(user.id)
    setEditingRole(user.role)
  }

  const cancelEditing = () => {
    setEditingUserId(null)
    setEditingRole("")
  }

  const saveRole = async (userId: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: editingRole }).eq("id", userId)

      if (error) {
        throw error
      }

      // Update local state
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return { ...user, role: editingRole }
          }
          return user
        }),
      )

      toast({
        title: t("auth.success"),
        description: "User role updated successfully",
      })

      setEditingUserId(null)
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: t("auth.error"),
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "editor":
        return "bg-blue-500"
      case "volunteer":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("auth.user_management")}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder={t("auth.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("auth.users")}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-center py-4 text-gray-500">{t("auth.no_results")}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>{t("auth.role")}</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {user.first_name || user.last_name ? `${user.first_name || ""} ${user.last_name || ""}` : "-"}
                      </TableCell>
                      <TableCell>
                        {editingUserId === user.id ? (
                          <Select value={editingRole} onValueChange={setEditingRole}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">{t("auth.user")}</SelectItem>
                              <SelectItem value="volunteer">{t("auth.volunteer")}</SelectItem>
                              <SelectItem value="editor">{t("auth.editor")}</SelectItem>
                              <SelectItem value="admin">{t("auth.admin")}</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role === "user"
                              ? t("auth.user")
                              : user.role === "admin"
                                ? t("auth.admin")
                                : user.role === "editor"
                                  ? t("auth.editor")
                                  : user.role === "volunteer"
                                    ? t("auth.volunteer")
                                    : user.role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {editingUserId === user.id ? (
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => saveRole(user.id)} className="h-8 px-2">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEditing}
                              className="h-8 px-2 text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} className="h-8 px-2">
                            <Edit2 className="h-4 w-4 mr-1" />
                            {t("auth.edit")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
