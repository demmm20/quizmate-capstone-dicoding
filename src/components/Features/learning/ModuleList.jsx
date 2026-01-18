

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Card from "../../common/Card";
import Button from "../../common/Button";

const ModuleList = ({
  modules = [],
  onSelectModule,
  completedModules = [],
}) => {
  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isCompleted = completedModules.includes(module.id);

        return (
          <Card
            key={module.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            bordered
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 shrink-0">
                  <h3 className="font-semibold text-gray-900">
                    {module.title}
                  </h3>
                  {isCompleted && (
                    <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0" />
                  )}
                </div>
              </div>

              <Button
                onClick={() => onSelectModule?.(module.id)}
                variant={isCompleted ? "secondary" : "primary"}
                size="sm"
                className="ml-4 shrink-0"
              >
                {isCompleted ? "Ulangi" : "Belajar"}
              </Button>
            </div>
          </Card>
        );
      })}

      {modules.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-600">Tidak ada modul tersedia</p>
        </Card>
      )}
    </div>
  );
};

export default ModuleList;
