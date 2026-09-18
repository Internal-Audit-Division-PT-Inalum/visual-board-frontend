import type { DivisionEmployee } from '@/types/api';
import { Users, ChevronRight } from 'lucide-react';

interface DivisionEmployeesProps {
  employees: DivisionEmployee[];
}

export function DivisionEmployees({ employees }: DivisionEmployeesProps) {
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 text-center text-slate-500 font-medium h-full flex items-center justify-center font-sans">
        Data pegawai tidak tersedia.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col font-sans overflow-hidden">
      
      <div className="bg-[#0A2F66] p-5 relative overflow-hidden shrink-0">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute right-10 bottom-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 border border-white/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg uppercase tracking-wide">
              Daftar Pegawai Divisi
            </h3>
            <p className="text-blue-200 text-xs font-medium mt-0.5">
              DIVISI IIA • Posisi & Departemen
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {employees.map((employee, index) => {
            // Level 1 & 2 (Manajemen) span full width, others take 1 column
            const isManagement = employee.hierarchy_level && employee.hierarchy_level <= 2;
            const spanClass = isManagement ? 'sm:col-span-2' : '';
            
            // Warna border berdasarkan level
            const getBorderColor = (level?: number) => {
              if (level === 1) return 'bg-amber-400 group-hover:bg-amber-500';
              if (level === 2) return 'bg-emerald-400 group-hover:bg-emerald-500';
              return 'bg-slate-300 group-hover:bg-blue-500';
            };

            // Warna ring/avatar berdasarkan level
            const getAvatarStyle = (level?: number) => {
              if (level === 1) return 'from-amber-500 to-amber-700 ring-amber-100 group-hover:ring-amber-200';
              if (level === 2) return 'from-emerald-500 to-emerald-700 ring-emerald-100 group-hover:ring-emerald-200';
              return 'from-[#0A2F66] to-[#1E40AF] ring-slate-100 group-hover:ring-blue-100';
            };

            return (
            <div key={employee.user_id + index} className={`group relative bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden cursor-default ${spanClass}`}>
              
              <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${getBorderColor(employee.hierarchy_level)}`}></div>

              <div className="flex items-center gap-4 relative z-10">
                
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-black text-lg uppercase shadow-sm shrink-0 border-2 border-white ring-2 transition-all ${getAvatarStyle(employee.hierarchy_level)}`}>
                  {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-800 text-sm truncate">{employee.name}</p>
                  <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wider mt-0.5 truncate">{employee.role_label}</p>
                  <p className="text-slate-500 text-xs font-medium truncate mt-1 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    {employee.unit}
                  </p>
                </div>
              </div>

            </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

