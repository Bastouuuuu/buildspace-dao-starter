import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useClan from '../hooks/useClan';
import useWar from '../hooks/useWar';
import useCapital from '../hooks/useCapital';
import { CLAN_ROLES } from '../services/cocConstants';
import { getSettings, saveSettings } from '../services/storageService';

const ClanDashboard = () => {
  const { clanTag } = useParams();
  const navigate = useNavigate();
  const { clan, members, loading, error, refresh } = useClan(`#${clanTag}`, true);
  const { currentWar, warStats, loading: warLoading } = useWar(`#${clanTag}`, true);
  const { seasons, loading: capitalLoading } = useCapital(`#${clanTag}`, 5);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSetFavorite = () => {
    const settings = getSettings();
    settings.favoriteClanTag = `#${clanTag}`;
    saveSettings(settings);
    alert('Clan défini comme favori!');
  };

  const goToPlayer = (playerTag) => {
    const cleanTag = playerTag.replace('#', '');
    navigate(`/player/${cleanTag}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement des données du clan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  if (!clan) {
    return null;
  }

  // Calculer la distribution des TH
  const thDistribution = members?.reduce((acc, member) => {
    const th = member.townHallLevel;
    acc[th] = (acc[th] || 0) + 1;
    return acc;
  }, {}) || {};

  // Calculer le taux de participation
  const avgDonations = members
    ? members.reduce((sum, m) => sum + m.donations, 0) / members.length
    : 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Retour
        </button>
        <div className="header-actions">
          <button onClick={handleSetFavorite} className="favorite-button">
            ⭐ Définir comme favori
          </button>
          <button onClick={refresh} className="refresh-button">
            🔄 Rafraîchir
          </button>
        </div>
      </div>

      {/* Clan Profile Card */}
      <div className="card clan-profile-card">
        <div className="profile-header">
          <div className="profile-main">
            <h1>{clan.name}</h1>
            <p className="clan-tag">{clan.tag}</p>
            <p className="clan-description">{clan.description}</p>
            <div className="profile-badges">
              <span className="badge badge-level">Niveau {clan.clanLevel}</span>
              <span className="badge badge-members">
                {clan.members}/{clan.clanWarLeague?.name || 'N/A'} membres
              </span>
              {clan.isWarLogPublic && (
                <span className="badge badge-public">War Log Public</span>
              )}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Points Clan</span>
              <span className="stat-value">{clan.clanPoints?.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ligue de Guerre</span>
              <span className="stat-value">{clan.warLeague?.name || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Capital League</span>
              <span className="stat-value">{clan.capitalLeague?.name || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* War Stats */}
        <div className="war-stats">
          <div className="stat-box">
            <span className="stat-label">Victoires</span>
            <span className="stat-value positive">{clan.warWins || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Défaites</span>
            <span className="stat-value negative">{clan.warLosses || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Égalités</span>
            <span className="stat-value neutral">{clan.warTies || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Win Streak</span>
            <span className="stat-value">{clan.warWinStreak || 0}</span>
          </div>
          {warStats && (
            <div className="stat-box">
              <span className="stat-label">Taux de victoire</span>
              <span className="stat-value">{warStats.winRate?.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Membres ({clan.members})
        </button>
        <button
          className={`tab ${activeTab === 'war' ? 'active' : ''}`}
          onClick={() => setActiveTab('war')}
        >
          Guerre
        </button>
        <button
          className={`tab ${activeTab === 'capital' ? 'active' : ''}`}
          onClick={() => setActiveTab('capital')}
        >
          Capital
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="overview-grid">
            {/* TH Distribution */}
            <div className="card">
              <h2>Distribution des Town Halls</h2>
              <div className="th-distribution">
                {Object.entries(thDistribution)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([th, count]) => (
                    <div key={th} className="th-bar">
                      <span className="th-label">TH {th}</span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(count / clan.members) * 100}%` }}
                        />
                      </div>
                      <span className="th-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Activity Index */}
            <div className="card">
              <h2>Activité du Clan</h2>
              <div className="activity-stats">
                <div className="activity-item">
                  <span className="activity-label">Donations moyennes</span>
                  <span className="activity-value">{avgDonations.toFixed(0)}</span>
                </div>
                <div className="activity-item">
                  <span className="activity-label">Membres actifs</span>
                  <span className="activity-value">
                    {members?.filter(m => m.donations > 0).length || 0}/{clan.members}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && members && (
        <div className="tab-content">
          <div className="card">
            <h2>Liste des Membres</h2>
            <div className="members-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>TH</th>
                    <th>Trophées</th>
                    <th>Donations</th>
                    <th>Reçues</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .sort((a, b) => {
                      const roleOrder = { leader: 4, coLeader: 3, admin: 2, member: 1 };
                      return (roleOrder[b.role] || 0) - (roleOrder[a.role] || 0);
                    })
                    .map(member => (
                      <tr key={member.tag}>
                        <td>
                          <strong>{member.name}</strong>
                          <br />
                          <small>{member.tag}</small>
                        </td>
                        <td>
                          <span className="role-badge">
                            {CLAN_ROLES[member.role]?.icon} {CLAN_ROLES[member.role]?.name}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-th">TH {member.townHallLevel}</span>
                        </td>
                        <td>{member.trophies?.toLocaleString()}</td>
                        <td className="positive">{member.donations}</td>
                        <td>{member.donationsReceived}</td>
                        <td>
                          <button
                            onClick={() => goToPlayer(member.tag)}
                            className="link-button"
                          >
                            Voir →
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'war' && (
        <div className="tab-content">
          {warLoading ? (
            <div className="loading">Chargement des données de guerre...</div>
          ) : currentWar && currentWar.state !== 'notInWar' ? (
            <div className="card">
              <h2>Guerre en cours</h2>
              <div className="war-status">
                <p>État: {currentWar.state}</p>
                {currentWar.clan && currentWar.opponent && (
                  <>
                    <div className="war-matchup">
                      <div className="war-team">
                        <h3>{currentWar.clan.name}</h3>
                        <p className="war-stars">⭐ {currentWar.clan.stars}</p>
                        <p>{currentWar.clan.destructionPercentage?.toFixed(2)}%</p>
                      </div>
                      <div className="war-vs">VS</div>
                      <div className="war-team">
                        <h3>{currentWar.opponent.name}</h3>
                        <p className="war-stars">⭐ {currentWar.opponent.stars}</p>
                        <p>{currentWar.opponent.destructionPercentage?.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="war-info">
                      <p>Taille: {currentWar.teamSize} vs {currentWar.teamSize}</p>
                      <p>Attaques par membre: {currentWar.attacksPerMember}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <h2>Pas de guerre en cours</h2>
              <p>Le clan n'est actuellement pas en guerre.</p>
            </div>
          )}

          {warStats && (
            <div className="card">
              <h2>Statistiques de guerre</h2>
              <div className="war-stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Total guerres</span>
                  <span className="stat-value">{warStats.total}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Victoires</span>
                  <span className="stat-value positive">{warStats.wins}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Défaites</span>
                  <span className="stat-value negative">{warStats.losses}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Étoiles moy.</span>
                  <span className="stat-value">{warStats.avgStars?.toFixed(1)}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Destruction moy.</span>
                  <span className="stat-value">{warStats.avgDestruction?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'capital' && (
        <div className="tab-content">
          {capitalLoading ? (
            <div className="loading">Chargement des données du capital...</div>
          ) : seasons && seasons.length > 0 ? (
            <div className="card">
              <h2>Saisons du Capital Raid</h2>
              <div className="capital-seasons">
                {seasons.map((season, index) => (
                  <div key={index} className="season-card">
                    <h3>Saison {index + 1}</h3>
                    <div className="season-stats">
                      <div className="season-stat">
                        <span>Capital Gold</span>
                        <span className="stat-value">{season.capitalTotalLoot?.toLocaleString()}</span>
                      </div>
                      <div className="season-stat">
                        <span>Raids complétés</span>
                        <span className="stat-value">{season.raidsCompleted}</span>
                      </div>
                      <div className="season-stat">
                        <span>Total attaques</span>
                        <span className="stat-value">{season.totalAttacks}</span>
                      </div>
                      <div className="season-stat">
                        <span>Districts détruits</span>
                        <span className="stat-value">{season.enemyDistrictsDestroyed}</span>
                      </div>
                      {season.totalAttacks > 0 && (
                        <div className="season-stat">
                          <span>Moyenne/attaque</span>
                          <span className="stat-value">
                            {(season.capitalTotalLoot / season.totalAttacks).toFixed(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <h2>Aucune donnée de capital disponible</h2>
              <p>Aucune saison de raid du capital n'a été trouvée.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClanDashboard;
