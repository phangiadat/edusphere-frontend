import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string;
  changeText: string;
  isPositive?: boolean;
  icon: React.ElementType;
  iconVariant?: 'purple' | 'indigo' | 'amber' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  changeText,
  isPositive = true,
  icon: Icon,
  iconVariant = 'purple',
}) => {
  const getIconClass = () => {
    switch (iconVariant) {
      case 'indigo':
        return styles.iconIndigo;
      case 'amber':
        return styles.iconAmber;
      case 'emerald':
        return styles.iconEmerald;
      default:
        return styles.iconPurple;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <span className={styles.title}>{title}</span>
        <div className={`${styles.iconBox} ${getIconClass()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className={styles.valRow}>
        <span className={styles.value}>{value}</span>
        <div
          className={`${styles.badge} ${
            isPositive ? styles.badgePositive : styles.badgeNeutral
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          <span>{changeText}</span>
        </div>
      </div>
    </div>
  );
};
