"use client"

import { useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Server } from "@/types"

interface ServerSelectorProps {
  servers: Server[]
  selectedServer: Server | null
  onSelectServer: (server: Server) => void
  disabled?: boolean
}

export function ServerSelector({ servers, selectedServer, onSelectServer, disabled = false }: ServerSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Globe className="h-4 w-4 mr-2 text-[#20B2AA]" />
        <span className="text-sm font-medium text-[#20B2AA]">Test Server</span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/20 backdrop-blur-sm border-white/20 hover:bg-[#20B2AA]/10 text-[#20B2AA] rounded-xl"
            disabled={disabled}
          >
            {selectedServer ? (
              <div className="flex items-center">
                <span className="mr-2">{selectedServer.location}</span>
                <span className="text-xs text-muted-foreground">({selectedServer.distance} km)</span>
              </div>
            ) : (
              "Select server..."
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white/90 backdrop-blur-md border-white/20 rounded-xl">
          <Command>
            <CommandInput placeholder="Search servers..." className="border-none focus:ring-0" />
            <CommandList>
              <CommandEmpty>No server found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {servers.map((server) => (
                  <CommandItem
                    key={server.id}
                    value={server.location}
                    onSelect={() => {
                      onSelectServer(server)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between hover:bg-[#20B2AA]/10 hover:text-[#20B2AA]"
                  >
                    <div className="flex items-center">
                      <span>{server.location}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({server.distance} km)</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{server.ping} ms</span>
                    {selectedServer?.id === server.id && <Check className="ml-2 h-4 w-4 text-[#20B2AA]" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedServer && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Hosted by {selectedServer.provider}</span>
          <span>Ping: {selectedServer.ping} ms</span>
        </div>
      )}
    </div>
  )
}

