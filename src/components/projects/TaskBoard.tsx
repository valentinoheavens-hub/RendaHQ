import React, { useState } from "react";
import { CheckCircle2, Circle, Plus, MoreVertical, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Research competitor visual identities", 
      status: "completed", 
      priority: "medium",
      assignee: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" }
    },
    { 
      id: 2, 
      title: "Draft 3 initial logo concepts", 
      status: "in-progress", 
      priority: "high",
      assignee: { name: "Felix K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" }
    },
    { 
      id: 3, 
      title: "Select typography pairings", 
      status: "todo", 
      priority: "medium",
      assignee: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" }
    },
    { 
      id: 4, 
      title: "Create color palette variations", 
      status: "todo", 
      priority: "low",
      assignee: { name: "Marcus T.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" }
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === "completed" ? "todo" : "completed" } : t
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900">Project Tasks</h3>
        <Button variant="ghost" size="sm" className="text-indigo-600 h-8 gap-1">
          <Plus className="w-3 h-3" /> Add Task
        </Button>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-xl border transition-all group",
              task.status === "completed" ? "bg-slate-50 border-transparent" : "bg-white border-slate-100 hover:border-indigo-100"
            )}
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "transition-colors",
                  task.status === "completed" ? "text-emerald-500" : "text-slate-300 hover:text-indigo-500"
                )}
              >
                {task.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <span className={cn(
                "text-sm font-medium",
                task.status === "completed" ? "text-slate-400 line-through" : "text-slate-700"
              )}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn(
                "text-[10px] px-1.5 py-0 border-none",
                task.priority === "high" ? "bg-rose-50 text-rose-600" : 
                task.priority === "medium" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
              )}>
                {task.priority}
              </Badge>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-6 h-6 rounded-full border border-white">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px] font-bold">Assigned to {task.assignee.name}</p>
                </TooltipContent>
              </Tooltip>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;