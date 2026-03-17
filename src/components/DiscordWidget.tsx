import React, { useEffect, useState } from 'react';
import { MessageSquare, Users, ExternalLink } from 'lucide-react';

interface DiscordData {
  name: string;
  instant_invite: string;
  presence_count: number;
  member_count?: number;
  members: {
    username: string;
    avatar_url: string;
  }[];
}

export function DiscordWidget() {
  const [data, setData] = useState<DiscordData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic widget data (for avatars and online count)
        const widgetRes = await fetch('https://discord.com/api/guilds/1480374470924439717/widget.json');
        const widgetData = await widgetRes.json();
        
        // Fetch invite data (for total member count)
        const inviteRes = await fetch('https://discord.com/api/v9/invites/huRuHCbf?with_counts=true');
        const inviteData = await inviteRes.json();
        
        setData({
          ...widgetData,
          member_count: inviteData.approximate_member_count || 0
        });
      } catch (error) {
        console.error('Error fetching Discord data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) return null;

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="relative group">
        {/* Background Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        
        {/* Main Card */}
        <div className="relative bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  Join Community
                </h3>
                <p className="text-gray-400 text-sm">
                  {data.name}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                  {data.presence_count} Online
                </span>
              </div>
              {data.member_count && (
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mr-1">
                  {data.member_count.toLocaleString()} Members
                </span>
              )}
            </div>
          </div>

          {/* Members Avatars */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex -space-x-3">
              {data.members.slice(0, 5).map((member, i) => (
                <img
                  key={i}
                  src={member.avatar_url}
                  alt={member.username}
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover"
                  referrerPolicy="no-referrer"
                />
              ))}
              {data.presence_count > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400 backdrop-blur-sm">
                  +{data.presence_count - 5}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium ml-2">
              active members online
            </span>
          </div>

          {/* Action Button */}
          <a
            href={data.instant_invite}
            target="_blank"
            rel="noreferrer"
            className="group/btn relative w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Join Discord Server</span>
            <ExternalLink className="w-4 h-4 relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            
            {/* Button Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shine" />
          </a>
        </div>
      </div>
    </div>
  );
}
